import json
import os
from pymongo import MongoClient

client = MongoClient("mongodb://bctool:phev@localhost:27017")
dbname = client['bctool']

print('Starting ways')

collection_name = dbname['ways_v4_partial']
collection_name.delete_many({})

way_files = [
    "Study_Area_Bike_Output_job_pop_v5.geojson",
]

for file in way_files:
    geojson = json.load(open(os.path.join('output', file)))
    collection_name.insert_many(geojson['features'])


print('Starting intersections')

collection_name = dbname['intersections_v4_partial']
collection_name.delete_many({})

intersection_files = [
    'Study_Area_Ped_Output_job_pop_v4.geojson',
]

for file in intersection_files:
    geojson = json.load(open(os.path.join('output', file)))
    collection_name.insert_many(geojson['features'])

# db.intersections_v4_partial.createIndex({"geometry": "2dsphere"});
# db.ways_v4_partial.createIndex({"geometry": "2dsphere"});
# db.intersections_v4_partial.createIndex({'properties.node_id': 1}, {unique: true})
# db.ways_v4_partial.createIndex({'properties.edge_uid': 1}, {unique: true})
# db.intersections_v4_partial.createIndex({'properties.source': 1})
# db.intersections_v4_partial.createIndex({'properties.target': 1})
