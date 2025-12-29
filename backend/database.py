from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

db = client["dss_portal"]
users_collection = db["users"]
public_keys_collection = db["public_keys"]
