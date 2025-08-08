from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
import json
from typing import Dict, List, Any
from collections import defaultdict, Counter
import re
from datetime import datetime

from ..config.models import get_db, Corpus, SDGMapping, User 
from ..utils import authhenticate_and_get_user_details

router = APIRouter()

@router.get("/graph-data")
def get_graph_data(
    db: Session = Depends(get_db),
    user_details: dict = Depends(authhenticate_and_get_user_details)
):
    try:
        current_user = db.query(User).filter(User.id == user_details["user_id"]).first()
        if not current_user:
            raise HTTPException(status_code=404, detail="User not found.")
        print(f"User '{current_user.user_name}' is requesting graph data.")
    except Exception as e:
        print(f"Error fetching user: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during user fetch.")

    try:
        corpus_data = db.query(Corpus).all()
        mapping_data = db.query(SDGMapping).all()
    except Exception as e:
        print(f"Error fetching corpus or mapping data: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during data fetch.")

    nodes = {}
    links = []
    
    # === Logika untuk mengumpulkan data tooltip ===
    sdg_labels = {
        1: "No Poverty", 2: "Zero Hunger", 3: "Good Health and Well-being",
        4: "Quality Education", 5: "Gender Equality", 6: "Clean Water and Sanitation",
        7: "Affordable and Clean Energy", 8: "Decent Work and Economic Growth",
        9: "Industry, Innovation and Infrastructure", 10: "Reduced Inequalities",
        11: "Sustainable Cities and Communities", 12: "Responsible Consumption and Production",
        13: "Climate Action", 14: "Life Below Water", 15: "Life on Land",
        16: "Peace, Justice and Strong Institutions", 17: "Partnerships for the Goals"
    }

    topic_to_sdg = {}
    sdg_mapping_tracker = {}

    for mapping in mapping_data:
        topic_id = f"topic_{mapping.topic_id}"
        sdg_id = f"sdg_{mapping.sdg_id}"
        topic_to_sdg.setdefault(topic_id, []).append({
            "sdg_id": sdg_id,
            "sdg_name": sdg_labels.get(mapping.sdg_id, mapping.sdg_name),
            "weight": mapping.mapping_weight
        })

    # Iterasi data corpus untuk membuat node dan link
    for paper in corpus_data:
        if not paper.doi:
            print(f"Skipping paper with ID {paper.id} due to missing DOI.")
            continue

        pub_id = f"doi:{paper.doi}"
        
        # Node Publikasi
        if pub_id not in nodes:
            nodes[pub_id] = {
                "id": pub_id, 
                "type": "Publication", 
                "title": paper.title,
                "abstract": paper.abstract
            }
        
        # Node Penulis dan Institusi
        try:
            authors_data = json.loads(paper.authors) if paper.authors else []
        except (json.JSONDecodeError, TypeError) as e:
            authors_data = []
            
        for author in authors_data:
            author_orcid = author.get('orcid', f"unknown_orcid_{hash(author.get('full_name', ''))}") 
            auth_id = f"orcid:{author_orcid}"

            if auth_id not in nodes:
                nodes[auth_id] = {
                    "id": auth_id,
                    "type": "Author",
                    "full_name": author.get("full_name", "Unknown Author")
                }
            links.append({
                "source": pub_id, 
                "target": auth_id, 
                "type": "AUTHORED_BY", 
                "position": author.get("position")
            })

            inst = author.get("institution")
            if inst and inst.get('name'):
                inst_name = inst.get("name", "Unknown Institution")
                inst_ror_id = inst.get('ror_id', f"unknown_ror_{hash(inst_name)}")
                inst_id = f"ror:{inst_ror_id}"
                
                if inst_id not in nodes:
                    nodes[inst_id] = {
                        "id": inst_id,
                        "type": "Institution",
                        "name": inst_name,
                        "country": inst.get("country")
                    }
                links.append({
                    "source": auth_id, 
                    "target": inst_id, 
                    "type": "AFFILIATED_WITH"
                })

        # Node Topik
        try:
            topics_data = json.loads(paper.topics) if paper.topics else []
        except (json.JSONDecodeError, TypeError) as e:
            topics_data = []

        for topic in topics_data:
            topic_id_val = topic.get('topic_id', f"unknown_topic_{hash(str(topic))}")
            topic_id = f"topic_{topic_id_val}"
            
            # Memperbarui tracker dengan data publikasi
            sdg_mapping_tracker.setdefault(topic_id, []).append({
                "pub_id": pub_id,
                "title": paper.title,
                "authors": authors_data,
                "keywords": topic.get("keywords", []),
                "topic_prob": topic.get("topic_probability", 0.0)
            })

            if topic_id not in nodes:
                nodes[topic_id] = {
                    "id": topic_id,
                    "type": "Topic",
                    "keywords": topic.get("keywords", [])
                }
            links.append({
                "source": pub_id,
                "target": topic_id,
                "type": "HAS_TOPIC",
                "topic_probability": topic.get("topic_probability")
            })
            
            # Menambahkan link dari Topik ke SDG
            for sdg in topic_to_sdg.get(topic_id, []):
                sdg_id = sdg["sdg_id"]
                weight = sdg["weight"]
                links.append({
                    "source": topic_id,
                    "target": sdg_id,
                    "type": "MAPS_TO_SDG",
                    "mapping_weight": weight
                })

    # === Membuat node SDG dan tooltip mendetail ===
    used_sdg_ids = {link["target"] for link in links if link["type"] == "MAPS_TO_SDG"}
    
    for sdg_id in used_sdg_ids:
        mappings_for_sdg = [link for link in links if link["target"] == sdg_id and link["type"] == "MAPS_TO_SDG"]
        
        tooltip_lines = []
        sdg_number = sdg_id.split('_')[1]
        sdg_name = sdg_labels.get(int(sdg_number), "Unknown SDG")
        tooltip_lines.append(f"SDG {sdg_number} - {sdg_name}\n")
        
        seen_pubs = set()
        for mapping in mappings_for_sdg:
            topic_id = mapping["source"]
            weight = mapping["mapping_weight"]
            
            topic_data = sdg_mapping_tracker.get(topic_id, [])
            
            for pub_info in topic_data:
                if pub_info["pub_id"] not in seen_pubs:
                    pub_title = pub_info["title"]
                    topic_keywords = ", ".join(pub_info["keywords"])
                    
                    tooltip_lines.append(f"Publication: {pub_title}")
                    
                    for author in pub_info["authors"]:
                        author_name = author.get("full_name", "Unknown Author")
                        institution_name = author.get("institution", {}).get("name", "Unknown Institution")
                        tooltip_lines.append(f"  - Author: {author_name} ({institution_name})")

                    tooltip_lines.append(f"Topic Keywords: {topic_keywords}")
                    tooltip_lines.append(f"Mapping Weight: {weight}\n")
                    
                    seen_pubs.add(pub_info["pub_id"])

        tooltip_text = "\n".join(tooltip_lines)
        
        if sdg_id not in nodes:
            nodes[sdg_id] = {
                "id": sdg_id,
                "type": "SDG",
                "name": f"SDG {sdg_number} - {sdg_name}",
                "tooltip": tooltip_text
            }
        else:
            nodes[sdg_id]["tooltip"] = tooltip_text

    return {"nodes": list(nodes.values()), "links": links}

# --- Tambahan endpoint baru di bawah ini ---

@router.get("/stats/sdg-counts")
def get_sdg_counts(db: Session = Depends(get_db), user_details: dict = Depends(authhenticate_and_get_user_details)):
    """Mengembalikan jumlah publikasi per SDG untuk visualisasi Bar Chart."""
    mappings = db.query(SDGMapping.topic_id, SDGMapping.sdg_id).all()
    corpus_data = db.query(Corpus.topics).all()
    
    sdg_pubs_count = defaultdict(int)
    sdg_labels = {
        1: "No Poverty", 2: "Zero Hunger", 3: "Good Health and Well-being",
        4: "Quality Education", 5: "Gender Equality", 6: "Clean Water and Sanitation",
        7: "Affordable and Clean Energy", 8: "Decent Work and Economic Growth",
        9: "Industry, Innovation and Infrastructure", 10: "Reduced Inequalities",
        11: "Sustainable Cities and Communities", 12: "Responsible Consumption and Production",
        13: "Climate Action", 14: "Life Below Water", 15: "Life on Land",
        16: "Peace, Justice and Strong Institutions", 17: "Partnerships for the Goals"
    }

    topic_sdg_map = defaultdict(list)
    for mapping in mappings:
        topic_sdg_map[f"{mapping.topic_id}"].append(mapping.sdg_id)

    for paper in corpus_data:
        try:
            topics = json.loads(paper.topics)
            for topic in topics:
                topic_id = str(topic['topic_id'])
                if topic_id in topic_sdg_map:
                    for sdg_id in topic_sdg_map[topic_id]:
                        sdg_pubs_count[sdg_id] += 1
        except (json.JSONDecodeError, TypeError):
            continue

    result = []
    for sdg_id, count in sdg_pubs_count.items():
        result.append({
            "sdg_id": sdg_id,
            "sdg_name": sdg_labels.get(sdg_id, f"SDG {sdg_id}"),
            "count": count
        })
    
    return result

@router.get("/stats/institution-distribution")
def get_institution_distribution(db: Session = Depends(get_db), user_details: dict = Depends(authhenticate_and_get_user_details)):
    """Mengembalikan distribusi publikasi per institusi untuk Pie Chart."""
    corpus_data = db.query(Corpus.authors).all()
    
    institution_counts = defaultdict(int)
    for paper in corpus_data:
        try:
            authors = json.loads(paper.authors)
            seen_institutions = set()
            for author in authors:
                institution = author.get("institution", {})
                inst_name = institution.get("name")
                if inst_name and inst_name not in seen_institutions:
                    institution_counts[inst_name] += 1
                    seen_institutions.add(inst_name)
        except (json.JSONDecodeError, TypeError):
            continue

    sorted_counts = sorted(institution_counts.items(), key=lambda item: item[1], reverse=True)
    
    result = []
    other_count = 0
    for i, (name, count) in enumerate(sorted_counts):
        if i < 5:
            result.append({"name": name, "value": count})
        else:
            other_count += count
    
    if other_count > 0:
        result.append({"name": "Lainnya", "value": other_count})
        
    return result

    # ================================
    # VERSI DUMMY (TIDAK AKTIF)
    # ================================

    # base_nodes = [
#     {"id": "doi:paper_001", "type": "Publication", "title": "Sustainable Agriculture Innovation"},
#     {"id": "doi:paper_002", "type": "Publication", "title": "Climate Change Policy in Urban Areas"},
#     {"id": "orcid:1234", "type": "Author", "full_name": "Dr. Aulia Rahman"},
#     {"id": "orcid:5678", "type": "Author", "full_name": "Prof. Intan Permata"},
#     {"id": "ror:abcd123", "type": "Institution", "name": "Universitas Gadjah Mada", "country": "Indonesia"},
#     {"id": "ror:wxyz789", "type": "Institution", "name": "Universitas Airlangga", "country": "Indonesia"},
#     {"id": "topic_1", "type": "Topic", "keywords": ["sustainable", "agriculture"]},
#     {"id": "topic_2", "type": "Topic", "keywords": ["food", "security"]},
#     {"id": "topic_3", "type": "Topic", "keywords": ["climate", "carbon"]},
#     {"id": "topic_4", "type": "Topic", "keywords": ["urban", "infrastructure"]},
#     {"id": "topic_5", "type": "Topic", "keywords": ["resilience", "policy"]}
# ]

# links = [
#     {"source": "doi:paper_001", "target": "orcid:1234", "type": "AUTHORED_BY"},
#     {"source": "doi:paper_002", "target": "orcid:5678", "type": "AUTHORED_BY"},
#     {"source": "orcid:1234", "target": "ror:abcd123", "type": "AFFILIATED_WITH"},
#     {"source": "orcid:5678", "target": "ror:wxyz789", "type": "AFFILIATED_WITH"},
#     {"source": "doi:paper_001", "target": "topic_1", "type": "HAS_TOPIC", "topic_probability": 0.82, "tooltip": "HAS_TOPIC\nProbabilitas topik: 0.82"},
#     {"source": "doi:paper_001", "target": "topic_2", "type": "HAS_TOPIC", "topic_probability": 0.76, "tooltip": "HAS_TOPIC\nProbabilitas topik: 0.76"},
#     {"source": "doi:paper_001", "target": "topic_5", "type": "HAS_TOPIC", "topic_probability": 0.65, "tooltip": "HAS_TOPIC\nProbabilitas topik: 0.65"},
#     {"source": "doi:paper_002", "target": "topic_3", "type": "HAS_TOPIC", "topic_probability": 0.80, "tooltip": "HAS_TOPIC\nProbabilitas topik: 0.80"},
#     {"source": "doi:paper_002", "target": "topic_4", "type": "HAS_TOPIC", "topic_probability": 0.74, "tooltip": "HAS_TOPIC\nProbabilitas topik: 0.74"},
#     {"source": "doi:paper_002", "target": "topic_5", "type": "HAS_TOPIC", "topic_probability": 0.62, "tooltip": "HAS_TOPIC\nProbabilitas topik: 0.62"},
#     {"source": "topic_1", "target": "sdg_2", "type": "MAPS_TO_SDG", "mapping_weight": 0.85},
#     {"source": "topic_2", "target": "sdg_2", "type": "MAPS_TO_SDG", "mapping_weight": 0.88},
#     {"source": "topic_1", "target": "sdg_12", "type": "MAPS_TO_SDG", "mapping_weight": 0.70},
#     {"source": "topic_3", "target": "sdg_13", "type": "MAPS_TO_SDG", "mapping_weight": 0.92},
#     {"source": "topic_3", "target": "sdg_7", "type": "MAPS_TO_SDG", "mapping_weight": 0.65},
#     {"source": "topic_4", "target": "sdg_11", "type": "MAPS_TO_SDG", "mapping_weight": 0.80},
#     {"source": "topic_4", "target": "sdg_9", "type": "MAPS_TO_SDG", "mapping_weight": 0.73},
#     {"source": "topic_5", "target": "sdg_13", "type": "MAPS_TO_SDG", "mapping_weight": 0.78},
#     {"source": "topic_5", "target": "sdg_16", "type": "MAPS_TO_SDG", "mapping_weight": 0.69}
# ]

# used_sdg_ids = {link["target"] for link in links if link["type"] == "MAPS_TO_SDG"}

# sdg_labels = {
#     "sdg_2": "Zero Hunger", "sdg_7": "Affordable and Clean Energy",
#     "sdg_9": "Industry, Innovation and Infrastructure", "sdg_11": "Sustainable Cities and Communities",
#     "sdg_12": "Responsible Consumption and Production", "sdg_13": "Climate Action",
#     "sdg_16": "Peace, Justice and Strong Institutions"
# }

# sdg_tooltip = {
#     "sdg_2": [("topic_1", 0.85), ("topic_2", 0.88)],
#     "sdg_12": [("topic_1", 0.70)],
#     "sdg_13": [("topic_3", 0.92), ("topic_5", 0.78)],
#     "sdg_7": [("topic_3", 0.65)],
#     "sdg_11": [("topic_4", 0.80)],
#     "sdg_9": [("topic_4", 0.73)],
#     "sdg_16": [("topic_5", 0.69)]
# }

# sdg_nodes = []
# for sdg_id in used_sdg_ids:
#     mappings = sdg_tooltip.get(sdg_id, [])
#     tooltip_lines = []
#     for topic_id, weight in mappings:
#         author = "Dr. Aulia Rahman" if topic_id == "topic_1" else "Prof. Intan Permata"
#         institution = "Universitas Gadjah Mada" if topic_id == "topic_1" else "Universitas Airlangga"
#         keywords = " ".join(topic_id.split("_"))  # dummy keywords

#         tooltip_lines.append(
#             f"Mapped from topic:\n- {keywords} (weight: {weight})\n  Author: {author}\n  Institution: {institution}"
#         )

#     tooltip_text = f"{sdg_id.upper().replace('_', ' ')} - {sdg_labels.get(sdg_id, 'Unknown')}\n" + "\n\n".join(tooltip_lines)
#     sdg_nodes.append({
#         "id": sdg_id,
#         "type": "SDG",
#         "name": f"{sdg_id.upper().replace('_', ' ')} - {sdg_labels.get(sdg_id, 'Unknown')}",
#         "tooltip": tooltip_text
#     })

# result = {
#     "nodes": base_nodes + sdg_nodes,
#     "links": links
# }