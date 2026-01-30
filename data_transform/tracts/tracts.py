import json
import os
from pymongo import MongoClient, IndexModel, GEOSPHERE
import shapefile

# data source:
# https://catalog.data.gov/dataset/tiger-line-shapefile-2021-state-california-census-tracts
# tl_2021_06_tract.zip

population = json.load(open(os.path.join(
    '..',
    'health',
    'output',
    'population.json',
)))

shapefilepath = os.path.join(
    'input',
    'tl_2021_06_tract',
    'tl_2021_06_tract.shp',
)

with shapefile.Reader(shapefilepath) as shp:
    geojson_data = shp.__geo_interface__

for feature in geojson_data['features']:
    geoid =  feature['properties']['GEOID']

    feature['properties'] = {
        'GEOID': geoid,
        'population': population[geoid]
    }

client = MongoClient("mongodb://bctool:phev@localhost:27017")
dbname = client['bctool']

collection_name = dbname['tracts']
collection_name.delete_many({})
collection_name.drop_indexes()

indexes = [
    IndexModel(['geometry', GEOSPHERE]),
    IndexModel('properties.GEOID', unique=True),
]

# read in population lookup from data_transform/health/output
# read in shapefile
# convert each feature to geojson
# set new properties object with GEOID and population[GEOID]
# insert features

collection_name.insert_many(geojson_data['features'])

collection_name.create_indexes(indexes)
