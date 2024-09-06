import json
import os
import uuid

files = [
    {
        "infilename": "woodland.json",
        "outfilename": "woodland_intersections.json"
    },
    {
        "infilename": "sacramento.json",
        "outfilename": "sacramento_intersections.json"
    },
]

all_intersections = []

for file in files:

    infilename = os.path.join("output", file['infilename'])

    geojson = json.load(open(infilename))

    intersections = {}
    new_id_lookup = {}

    for f in geojson['features']:

        int_a = int(f['properties']['INTERSECTI'])
        int_a_coords = f['geometry']['coordinates'][0]
        int_b = int(f['properties']['INTERSE_01'])
        int_b_coords = f['geometry']['coordinates'][-1]

        if int_a not in intersections:
            intersections[int_a] = int_a_coords

        if int_b not in intersections:
            intersections[int_b] = int_b_coords

    newjson = {
        "features": [],
        "type": "FeatureCollection",
    }

    for i in intersections.keys():

        new_id = str(uuid.uuid4())

        if new_id in all_intersections:
            print('Collision')
            exit()

        new_id_lookup[i] = new_id

        newjson["features"].append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": intersections[i],
            },
            "properties": {
                "id": new_id,
            }
        })

    for f in geojson['features']:
        f['properties']['INTERSECTI'] = new_id_lookup[f['properties']['INTERSECTI']]
        f['properties']['INTERSE_01'] = new_id_lookup[f['properties']['INTERSE_01']]

    json.dump(geojson, open(infilename, 'w'))

    outfilename = os.path.join('output', file['outfilename'])
    json.dump(newjson, open(outfilename, 'w'))

