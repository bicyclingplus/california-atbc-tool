import json
import os
from pymongo import MongoClient

client = MongoClient("mongodb://bctool:phev@localhost:27017")
dbname = client['bctool']

collection_name = dbname['ways']
collection_name.delete_many({})

way_files = [
    "woodland.json",
    "sacramento.json",
]

for file in way_files:
    geojson = json.load(open(os.path.join('output', file)))
    collection_name.insert_many(geojson['features'])






collection_name = dbname['intersections']
collection_name.delete_many({})

intersection_files = [
    "woodland_intersections.json",
    "sacramento_intersections.json",
]

for file in intersection_files:

    geojson = json.load(open(os.path.join('output', file)))
    collection_name.insert_many(geojson['features'])
