from fastapi import APIRouter
# from src.config.db import db  # Uncomment saat sudah konek DB

router = APIRouter()

@router.get("/graph-data")
async def get_graph_data():
    # ====================================
    # JIKA SUDAH ADA DATA AKTIFIN PAKE INI
    # ====================================
    """
    corpus_data = await db["Corpus"].find().to_list(1000)
    mapping_data = await db["SDG_Mapping"].find().to_list(1000)

    nodes = []
    links = []
    seen_nodes = set()

    topic_to_sdg = {}
    for map_entry in mapping_data:
        topic_id = map_entry["topic_id"]
        sdg_id = f"sdg_{map_entry['sdg_id']}"
        topic_to_sdg.setdefault(topic_id, []).append({
            "sdg_id": sdg_id,
            "sdg_name": map_entry["sdg_name"],
            "weight": map_entry["mapping_weight"]
        })

    for paper in corpus_data:
        pub_id = f"doi:{paper['doi']}"
        title = paper["title"]

        # Node: Publication
        if pub_id not in seen_nodes:
            nodes.append({
                "id": pub_id,
                "type": "Publication",
                "title": title
            })
            seen_nodes.add(pub_id)

        # Node: Authors & Institution + Edges
        for author in paper.get("authors", []):
            auth_id = f"orcid:{author['orcid']}"
            if auth_id not in seen_nodes:
                nodes.append({
                    "id": auth_id,
                    "type": "Author",
                    "full_name": author["full_name"]
                })
                seen_nodes.add(auth_id)

            links.append({
                "source": pub_id,
                "target": auth_id,
                "type": "AUTHORED_BY",
                "position": author.get("position")
            })

            inst = author.get("institution")
            if inst:
                inst_id = f"ror:{inst['ror_id']}"
                if inst_id not in seen_nodes:
                    nodes.append({
                        "id": inst_id,
                        "type": "Institution",
                        "name": inst["name"],
                        "country": inst["country"]
                    })
                    seen_nodes.add(inst_id)

                links.append({
                    "source": auth_id,
                    "target": inst_id,
                    "type": "AFFILIATED_WITH"
                })

        for topic in paper.get("topics", []):
            topic_id = topic["topic_id"]
            if topic_id not in seen_nodes:
                nodes.append({
                    "id": topic_id,
                    "type": "Topic",
                    "keywords": topic["keywords"]
                })
                seen_nodes.add(topic_id)

            links.append({
                "source": pub_id,
                "target": topic_id,
                "type": "HAS_TOPIC",
                "topic_probability": topic["topic_probability"]
            })

            for sdg in topic_to_sdg.get(topic_id, []):
                sdg_id = sdg["sdg_id"]
                if sdg_id not in seen_nodes:
                    nodes.append({
                        "id": sdg_id,
                        "type": "SDG",
                        "name": sdg["sdg_name"]
                    })
                    seen_nodes.add(sdg_id)

                links.append({
                    "source": topic_id,
                    "target": sdg_id,
                    "type": "MAPS_TO_SDG",
                    "mapping_weight": sdg["weight"]
                })

    return {"nodes": nodes, "links": links}
    """
    # ==============================
    # SAAT INI: Dummy Graph Data
    # ==============================
    
    return {
        "nodes": [
            # Publications
            {"id": "doi:paper_001", "type": "Publication", "title": "Sustainable Agriculture Innovation"},
            {"id": "doi:paper_002", "type": "Publication", "title": "Climate Change Policy in Urban Areass"},

            # Authors
            {"id": "orcid:1234", "type": "Author", "full_name": "Dr. Aulia Rahman"},
            {"id": "orcid:5678", "type": "Author", "full_name": "Prof. Intan Permata"},

            # Institutions
            {"id": "ror:abcd123", "type": "Institution", "name": "Universitas Gadjah Mada", "country": "Indonesia"},
            {"id": "ror:wxyz789", "type": "Institution", "name": "Universitas Airlangga", "country": "Indonesia"},

            # Topics (minimal 5 contoh relevan)
            {"id": "topic_1", "type": "Topic", "keywords": ["sustainable", "agriculture"]},
            {"id": "topic_2", "type": "Topic", "keywords": ["food", "security"]},
            {"id": "topic_3", "type": "Topic", "keywords": ["climate", "carbon"]},
            {"id": "topic_4", "type": "Topic", "keywords": ["urban", "infrastructure"]},
            {"id": "topic_5", "type": "Topic", "keywords": ["resilience", "policy"]},

            # SDGs (1–17)
            *[
                {"id": f"sdg_{i}", "type": "SDG", "name": name}
                for i, name in enumerate([
                    "No Poverty", "Zero Hunger", "Good Health and Well-being", "Quality Education",
                    "Gender Equality", "Clean Water and Sanitation", "Affordable and Clean Energy",
                    "Decent Work and Economic Growth", "Industry, Innovation and Infrastructure",
                    "Reduced Inequalities", "Sustainable Cities and Communities", "Responsible Consumption and Production",
                    "Climate Action", "Life Below Water", "Life on Land", "Peace, Justice and Strong Institutions",
                    "Partnerships for the Goals"
                ], start=1)
            ]
        ],
        "links": [
            # Authorships
            {"source": "doi:paper_001", "target": "orcid:1234", "type": "AUTHORED_BY"},
            {"source": "doi:paper_002", "target": "orcid:5678", "type": "AUTHORED_BY"},

            # Affiliations
            {"source": "orcid:1234", "target": "ror:abcd123", "type": "AFFILIATED_WITH"},
            {"source": "orcid:5678", "target": "ror:wxyz789", "type": "AFFILIATED_WITH"},

            # Publication → Topics
            {"source": "doi:paper_001", "target": "topic_1", "type": "HAS_TOPIC", "topic_probability": 0.82},
            {"source": "doi:paper_001", "target": "topic_2", "type": "HAS_TOPIC", "topic_probability": 0.76},
            {"source": "doi:paper_001", "target": "topic_5", "type": "HAS_TOPIC", "topic_probability": 0.65},

            {"source": "doi:paper_002", "target": "topic_3", "type": "HAS_TOPIC", "topic_probability": 0.80},
            {"source": "doi:paper_002", "target": "topic_4", "type": "HAS_TOPIC", "topic_probability": 0.74},
            {"source": "doi:paper_002", "target": "topic_5", "type": "HAS_TOPIC", "topic_probability": 0.62},

            # Topic → SDG (multi-mapping)
            {"source": "topic_1", "target": "sdg_2", "type": "MAPS_TO_SDG", "mapping_weight": 0.85},  # Zero Hunger
            {"source": "topic_1", "target": "sdg_12", "type": "MAPS_TO_SDG", "mapping_weight": 0.70}, # Responsible Consumption

            {"source": "topic_2", "target": "sdg_2", "type": "MAPS_TO_SDG", "mapping_weight": 0.88},

            {"source": "topic_3", "target": "sdg_13", "type": "MAPS_TO_SDG", "mapping_weight": 0.92},  # Climate Action
            {"source": "topic_3", "target": "sdg_7", "type": "MAPS_TO_SDG", "mapping_weight": 0.65},   # Clean Energy

            {"source": "topic_4", "target": "sdg_11", "type": "MAPS_TO_SDG", "mapping_weight": 0.80},  # Sustainable Cities
            {"source": "topic_4", "target": "sdg_9", "type": "MAPS_TO_SDG", "mapping_weight": 0.73},   # Innovation

            {"source": "topic_5", "target": "sdg_13", "type": "MAPS_TO_SDG", "mapping_weight": 0.78},
            {"source": "topic_5", "target": "sdg_16", "type": "MAPS_TO_SDG", "mapping_weight": 0.69}
        ]
    }