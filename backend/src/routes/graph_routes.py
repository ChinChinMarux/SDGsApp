from fastapi import APIRouter
from src.config.db import db

router = APIRouter()

@router.get("/graph-data")
async def get_graph_data():
    corpus_data = await db["corpus"].find().to_list(1000)
    mapping_data = await db["sdg_mapping"].find().to_list(1000)

    nodes = []
    links = []
    seen_nodes = set()

    for doc in corpus_data:
        user_id = doc.get("user_id")
        title = doc.get("title")
        analysis_id = str(doc.get("_id"))

        # Node peneliti
        if user_id and user_id not in seen_nodes:
            nodes.append({"id": user_id, "group": "peneliti"})
            seen_nodes.add(user_id)

        # Node publikasi
        if title and analysis_id not in seen_nodes:
            nodes.append({"id": title, "group": "publikasi"})
            seen_nodes.add(analysis_id)

        # Edge peneliti → publikasi
        if user_id and title:
            links.append({"source": user_id, "target": title})

        # Mapping SDG
        for map_entry in mapping_data:
            if map_entry["analysis_id"] == analysis_id:
                sdg = map_entry.get("mapping_result")
                if sdg and sdg not in seen_nodes:
                    nodes.append({"id": sdg, "group": "sdg"})
                    seen_nodes.add(sdg)

                # Edge publikasi → SDG
                if title and sdg:
                    links.append({"source": title, "target": sdg})

    return {"nodes": nodes, "links": links}