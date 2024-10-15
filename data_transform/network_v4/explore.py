import json
import os

# infilename = 'bike_predictions_strava_v1.geojson'
# infilename = 'Study_Area_Bike_Output_job_pop_v1.geojson'
infilename = 'Study_Area_Bike_Output_job_pop_v2.geojson'
infilepath = os.path.join('input', infilename)

geojson = json.load(open(infilepath))

for i in range(1):
    print(json.dumps(geojson['features'][i]))
