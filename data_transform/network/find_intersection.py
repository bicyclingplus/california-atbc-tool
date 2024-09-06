import json
import os

data = json.load(open(os.path.join('input', 'Sacramento_Bike_Predictions_check1.geojson')))

for f in data['features']:
    if f['properties']['edgeUID'] == 212467000:
        print(f)
        break

data = json.load(open(os.path.join('input', 'Sacramento_Ped_Network.geojson')))

for f in data['features']:
    if f['properties']['nodeID'] == 48216:
        print(f)
        break
