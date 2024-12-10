import json
import os

infilename = 'Study_Area_Bike_Output_job_pop_v9.geojson'
infilepath = os.path.join('input', infilename)

geojson = json.load(open(infilepath))

for i in range(1):
    print(json.dumps(geojson['features'][i]))


infilename = 'Study_Area_Ped_Output_job_pop_v10.geojson'
infilepath = os.path.join('input', infilename)

geojson = json.load(open(infilepath))

for i in range(1):
    print(json.dumps(geojson['features'][i]))
