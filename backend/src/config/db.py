from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

uri = os.getenv("MONGO_URI")

# Inisialisasi client dan database
client = AsyncIOMotorClient(uri)
db = client["sdg_mapping"]

# Fungsi ping async (dipanggil sekali saat startup)
async def ping_db():
    try:
        await client.admin.command("ping")
        print(" Connected to MongoDB!")
    except Exception as e:
        print(" MongoDB connection error:", e)