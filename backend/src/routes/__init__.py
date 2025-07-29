from config import db

async def init_db():
    await db["Corpus"].create_index("user_id")
    await db["Analysis"].create_index("corpus_id")
    await db["SDG_Mapping"].create_index("analysis_id")
    await db["SDG_Reference"].create_index("sdg_id")
    await db["SDG_Reference"].create_index("title", unique=True)
    print("✅ Database initialized")