import json
import os

infilename = 'bike_predictions_strava_v1.geojson'
infilepath = os.path.join('input', infilename)

geojson = json.load(open(infilepath))

for i in range(10):
    print(json.dumps(geojson['features'][i]['properties']))
