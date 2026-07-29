import json
import os
from pymongo import MongoClient, IndexModel, GEOSPHERE

client = MongoClient("mongodb://bctool:phev@localhost:27017")
dbname = client['bctool']

print('Starting ways')

collection_name = dbname['ways']
collection_name.delete_many({})
collection_name.drop_indexes()

way_files = [
    "links.geojson",
]

for file in way_files:
    geojson = json.load(open(os.path.join('input', file)))
    collection_name.insert_many(geojson['features'])

indexes = [
    IndexModel(['geometry', GEOSPHERE]),
    IndexModel('properties.edge_uid', unique=True),
    IndexModel('properties.source'),
    IndexModel('properties.target'),
]

collection_name.create_indexes(indexes)

print('Starting intersections')

collection_name = dbname['intersections']
collection_name.delete_many({})
collection_name.drop_indexes()

intersection_files = [
    'nodes.geojson',
]

for file in intersection_files:
    geojson = json.load(open(os.path.join('input', file)))
    collection_name.insert_many(geojson['features'])

indexes = [
    IndexModel(['geometry', GEOSPHERE]),
    IndexModel('properties.node_id', unique=True),
]

collection_name.create_indexes(indexes)

print('Starting blocks')

collection_name = dbname['blocks']
collection_name.delete_many({})
collection_name.drop_indexes()

blocks_files = [
    "2026_07_24_context_blocks.geojson",
]

for file in blocks_files:
    geojson = json.load(open(os.path.join('input', file)))
    collection_name.insert_many(geojson['features'])

indexes = [
    IndexModel(['geometry', GEOSPHERE]),
]

collection_name.create_indexes(indexes)
