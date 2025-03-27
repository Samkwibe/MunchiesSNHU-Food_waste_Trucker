from fastapi import FastAPI
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend requests (adjust origin as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("mongodb://localhost:27017/")
db = client["food_waste_db"]
collection = db["sensor_data"]

@app.get("/data")
def get_sensor_data():
    data = list(collection.find({}, {"_id": 0}))
    return {"data": data}
