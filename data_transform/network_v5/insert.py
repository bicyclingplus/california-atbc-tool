import json
import os
from pymongo import MongoClient, IndexModel, GEOSPHERE

client = MongoClient("mongodb://bctool:phev@localhost:27017")
dbname = client['bctool']

print('Starting ways')

goodprops = [
    "edge_uid",
    "source",
    "target",
    "functional",
    "bicycle_exposure_class",
    "pedestrian_exposure_class",
    "pred_bike_vol",
    "pred_ped_vol",
]

collection_name = dbname['ways']
collection_name.delete_many({})
collection_name.drop_indexes()

way_files = [
    "links.geojson",
]

for file in way_files:
    geojson = json.load(open(os.path.join('input', file)))

    for feature in geojson['features']:
        newprops = {}
        for p in feature['properties']:
            if p in goodprops:
                newprops[p] = feature['properties'][p]
        feature['properties'] = newprops

    collection_name.insert_many(geojson['features'])

indexes = [
    IndexModel(['geometry', GEOSPHERE]),
    IndexModel('properties.edge_uid', unique=True),
    IndexModel('properties.source'),
    IndexModel('properties.target'),
]

collection_name.create_indexes(indexes)

print('Starting intersections')

goodprops = [
    "node_id",
    "functional",
    "bicycle_exposure_class",
    "pedestrian_exposure_class",
    "pred_bike_vol",
    "pred_ped_vol",
]

collection_name = dbname['intersections']
collection_name.delete_many({})
collection_name.drop_indexes()

intersection_files = [
    'nodes.geojson',
]

for file in intersection_files:
    geojson = json.load(open(os.path.join('input', file)))

    for feature in geojson['features']:
        newprops = {}
        for p in feature['properties']:
            if p in goodprops:
                newprops[p] = feature['properties'][p]
        feature['properties'] = newprops

    collection_name.insert_many(geojson['features'])

indexes = [
    IndexModel(['geometry', GEOSPHERE]),
    IndexModel('properties.node_id', unique=True),
]

collection_name.create_indexes(indexes)

print('Starting blocks')

goodprops = [
    "pred_bike_vol_newpath",
    "pred_ped_vol_newpath",
]

collection_name = dbname['blocks']
collection_name.delete_many({})
collection_name.drop_indexes()

blocks_files = [
    "2026_07_29_context_blocks.geojson",
]

for file in blocks_files:
    geojson = json.load(open(os.path.join('input', file)))

    for feature in geojson['features']:
        newprops = {}
        for p in feature['properties']:
            if p in goodprops:
                newprops[p] = feature['properties'][p]
        feature['properties'] = newprops

    collection_name.insert_many(geojson['features'])

indexes = [
    IndexModel(['geometry', GEOSPHERE]),
]

collection_name.create_indexes(indexes)
