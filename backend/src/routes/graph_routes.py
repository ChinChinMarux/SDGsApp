from fastapi import APIRouter
# from src.config.db import db  # Uncomment ini saat koneksi DB aktif

router = APIRouter()

@router.get("/graph-data")
async def get_graph_data():
    # ================================
    # VERSI KONEK DATABASE (UNCOMMENT JIKA DB AKTIF)
    # ================================
    """
    corpus_data = await db["Corpus"].find().to_list(1000)
    mapping_data = await db["SDG_Mapping"].find().to_list(1000)

    nodes = []
    links = []
    seen_nodes = set()

    sdg_labels = {
        "sdg_1": "No Poverty", "sdg_2": "Zero Hunger", "sdg_3": "Good Health and Well-being",
        "sdg_4": "Quality Education", "sdg_5": "Gender Equality", "sdg_6": "Clean Water and Sanitation",
        "sdg_7": "Affordable and Clean Energy", "sdg_8": "Decent Work and Economic Growth",
        "sdg_9": "Industry, Innovation and Infrastructure", "sdg_10": "Reduced Inequalities",
        "sdg_11": "Sustainable Cities and Communities", "sdg_12": "Responsible Consumption and Production",
        "sdg_13": "Climate Action", "sdg_14": "Life Below Water", "sdg_15": "Life on Land",
        "sdg_16": "Peace, Justice and Strong Institutions", "sdg_17": "Partnerships for the Goals"
    }

    topic_to_sdg = {}
    topic_info = {}

    for map_entry in mapping_data:
        topic_id = map_entry["topic_id"]
        sdg_id = f"sdg_{map_entry['sdg_id']}"
        topic_to_sdg.setdefault(topic_id, []).append({
            "sdg_id": sdg_id,
            "sdg_name": map_entry["sdg_name"],
            "weight": map_entry["mapping_weight"]
        })

    sdg_mapping_tracker = {}

    for paper in corpus_data:
        pub_id = f"doi:{paper['doi']}"
        title = paper["title"]

        if pub_id not in seen_nodes:
            nodes.append({"id": pub_id, "type": "Publication", "title": title})
            seen_nodes.add(pub_id)

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
            topic_keywords = topic["keywords"]
            topic_prob = topic["topic_probability"]

            if topic_id not in seen_nodes:
                nodes.append({
                    "id": topic_id,
                    "type": "Topic",
                    "keywords": topic_keywords
                })
                seen_nodes.add(topic_id)

            links.append({
                "source": pub_id,
                "target": topic_id,
                "type": "HAS_TOPIC",
                "topic_probability": topic_prob,
                "tooltip": f"HAS_TOPIC\nProbabilitas topik: {topic_prob}"
            })

            main_author = paper["authors"][0] if paper["authors"] else {}
            topic_info[topic_id] = {
                "keywords": topic_keywords,
                "author": main_author.get("full_name", "Unknown"),
                "institution": main_author.get("institution", {}).get("name", "Unknown")
            }

            for sdg in topic_to_sdg.get(topic_id, []):
                sdg_id = sdg["sdg_id"]
                weight = sdg["weight"]
                sdg_mapping_tracker.setdefault(sdg_id, []).append((topic_id, weight))
                links.append({
                    "source": topic_id,
                    "target": sdg_id,
                    "type": "MAPS_TO_SDG",
                    "mapping_weight": weight
                })

    used_sdg_ids = set(link["target"] for link in links if link["type"] == "MAPS_TO_SDG")

    for sdg_id in used_sdg_ids:
        mappings = sdg_mapping_tracker.get(sdg_id, [])
        tooltip_lines = []
        for topic_id, weight in mappings:
            info = topic_info.get(topic_id, {})
            line = (
                f"Mapped from topic:\n"
                f"- {' '.join(info.get('keywords', []))} (weight: {weight})\n"
                f"  Author: {info.get('author')}\n"
                f"  Institution: {info.get('institution')}"
            )
            tooltip_lines.append(line)

        tooltip_text = f"{sdg_id.upper().replace('_', ' ')} - {sdg_labels.get(sdg_id, 'Unknown')}\n" + "\n\n".join(tooltip_lines)

        if sdg_id not in seen_nodes:
            nodes.append({
                "id": sdg_id,
                "type": "SDG",
                "name": f"{sdg_id.upper().replace('_', ' ')} - {sdg_labels.get(sdg_id, 'Unknown')}",
                "tooltip": tooltip_text
            })
            seen_nodes.add(sdg_id)

    return {"nodes": nodes, "links": links}
    """

    # ================================
    # VERSI DUMMY SAAT INI (AKTIF)
    # ================================

    base_nodes = [
        {"id": "doi:paper_001", "type": "Publication", "title": "Sustainable Agriculture Innovation"},
        {"id": "doi:paper_002", "type": "Publication", "title": "Climate Change Policy in Urban Areas"},
        {"id": "orcid:1234", "type": "Author", "full_name": "Dr. Aulia Rahman"},
        {"id": "orcid:5678", "type": "Author", "full_name": "Prof. Intan Permata"},
        {"id": "ror:abcd123", "type": "Institution", "name": "Universitas Gadjah Mada", "country": "Indonesia"},
        {"id": "ror:wxyz789", "type": "Institution", "name": "Universitas Airlangga", "country": "Indonesia"},
        {"id": "topic_1", "type": "Topic", "keywords": ["sustainable", "agriculture"]},
        {"id": "topic_2", "type": "Topic", "keywords": ["food", "security"]},
        {"id": "topic_3", "type": "Topic", "keywords": ["climate", "carbon"]},
        {"id": "topic_4", "type": "Topic", "keywords": ["urban", "infrastructure"]},
        {"id": "topic_5", "type": "Topic", "keywords": ["resilience", "policy"]}
    ]

    links = [
        {"source": "doi:paper_001", "target": "orcid:1234", "type": "AUTHORED_BY"},
        {"source": "doi:paper_002", "target": "orcid:5678", "type": "AUTHORED_BY"},
        {"source": "orcid:1234", "target": "ror:abcd123", "type": "AFFILIATED_WITH"},
        {"source": "orcid:5678", "target": "ror:wxyz789", "type": "AFFILIATED_WITH"},
        {"source": "doi:paper_001", "target": "topic_1", "type": "HAS_TOPIC", "topic_probability": 0.82, "tooltip": "HAS_TOPIC\nProbabilitas topik: 0.82"},
        {"source": "doi:paper_001", "target": "topic_2", "type": "HAS_TOPIC", "topic_probability": 0.76, "tooltip": "HAS_TOPIC\nProbabilitas topik: 0.76"},
        {"source": "doi:paper_001", "target": "topic_5", "type": "HAS_TOPIC", "topic_probability": 0.65, "tooltip": "HAS_TOPIC\nProbabilitas topik: 0.65"},
        {"source": "doi:paper_002", "target": "topic_3", "type": "HAS_TOPIC", "topic_probability": 0.80, "tooltip": "HAS_TOPIC\nProbabilitas topik: 0.80"},
        {"source": "doi:paper_002", "target": "topic_4", "type": "HAS_TOPIC", "topic_probability": 0.74, "tooltip": "HAS_TOPIC\nProbabilitas topik: 0.74"},
        {"source": "doi:paper_002", "target": "topic_5", "type": "HAS_TOPIC", "topic_probability": 0.62, "tooltip": "HAS_TOPIC\nProbabilitas topik: 0.62"},
        {"source": "topic_1", "target": "sdg_2", "type": "MAPS_TO_SDG", "mapping_weight": 0.85},
        {"source": "topic_2", "target": "sdg_2", "type": "MAPS_TO_SDG", "mapping_weight": 0.88},
        {"source": "topic_1", "target": "sdg_12", "type": "MAPS_TO_SDG", "mapping_weight": 0.70},
        {"source": "topic_3", "target": "sdg_13", "type": "MAPS_TO_SDG", "mapping_weight": 0.92},
        {"source": "topic_3", "target": "sdg_7", "type": "MAPS_TO_SDG", "mapping_weight": 0.65},
        {"source": "topic_4", "target": "sdg_11", "type": "MAPS_TO_SDG", "mapping_weight": 0.80},
        {"source": "topic_4", "target": "sdg_9", "type": "MAPS_TO_SDG", "mapping_weight": 0.73},
        {"source": "topic_5", "target": "sdg_13", "type": "MAPS_TO_SDG", "mapping_weight": 0.78},
        {"source": "topic_5", "target": "sdg_16", "type": "MAPS_TO_SDG", "mapping_weight": 0.69}
    ]

    used_sdg_ids = {link["target"] for link in links if link["type"] == "MAPS_TO_SDG"}

    sdg_labels = {
        "sdg_2": "Zero Hunger", "sdg_7": "Affordable and Clean Energy",
        "sdg_9": "Industry, Innovation and Infrastructure", "sdg_11": "Sustainable Cities and Communities",
        "sdg_12": "Responsible Consumption and Production", "sdg_13": "Climate Action",
        "sdg_16": "Peace, Justice and Strong Institutions"
    }

    sdg_tooltip = {
        "sdg_2": [("topic_1", 0.85), ("topic_2", 0.88)],
        "sdg_12": [("topic_1", 0.70)],
        "sdg_13": [("topic_3", 0.92), ("topic_5", 0.78)],
        "sdg_7": [("topic_3", 0.65)],
        "sdg_11": [("topic_4", 0.80)],
        "sdg_9": [("topic_4", 0.73)],
        "sdg_16": [("topic_5", 0.69)]
    }

    sdg_nodes = []
    for sdg_id in used_sdg_ids:
        mappings = sdg_tooltip.get(sdg_id, [])
        tooltip_lines = []
        for topic_id, weight in mappings:
            author = "Dr. Aulia Rahman" if topic_id == "topic_1" else "Prof. Intan Permata"
            institution = "Universitas Gadjah Mada" if topic_id == "topic_1" else "Universitas Airlangga"
            keywords = " ".join(topic_id.split("_"))  # dummy keywords

            tooltip_lines.append(
                f"Mapped from topic:\n- {keywords} (weight: {weight})\n  Author: {author}\n  Institution: {institution}"
            )

        tooltip_text = f"{sdg_id.upper().replace('_', ' ')} - {sdg_labels.get(sdg_id, 'Unknown')}\n" + "\n\n".join(tooltip_lines)
        sdg_nodes.append({
            "id": sdg_id,
            "type": "SDG",
            "name": f"{sdg_id.upper().replace('_', ' ')} - {sdg_labels.get(sdg_id, 'Unknown')}",
            "tooltip": tooltip_text
        })

    return {
        "nodes": base_nodes + sdg_nodes,
        "links": links
    }