import json
import os
from pymongo import MongoClient

client = MongoClient("mongodb://bctool:phev@localhost:27017")
dbname = client['bctool']

print('Starting ways')

collection_name = dbname['ways']
collection_name.delete_many({})

way_files = [
    # "Sacramento_Bike_Network.geojson",
    # "Sacramento_Bike_Predictions_check1.geojson",
    "2022_07_30_Final_network_links_merged.geojson",
]

for file in way_files:
    geojson = json.load(open(os.path.join('output', file)))
    collection_name.insert_many(geojson['features'])


print('Starting intersections')

collection_name = dbname['intersections']
collection_name.delete_many({})

intersection_files = [
    # "Sacramento_Ped_Network.geojson",
    # 'Final_network_nodes.geojson',
    '2022_07_30_Final_network_nodes.geojson',
]

for file in intersection_files:

    geojson = json.load(open(os.path.join('input', file)))
    collection_name.insert_many(geojson['features'])
