import shapefile
import json
import os

needed_fields = [
    "TDG_ID",
    "ONE_WAY_CA",
    "INTERSECTI",
    "INTERSE_01",
]

files = [
    {
        "folder": "neighborhood_ways_woodland",
        "shapefile": "neighborhood_ways_latlong",
        "outfilename": "woodland.json",
    },
    {
        "folder": "neighborhood_ways_sacramento",
        "shapefile": "neighborhood_ways_latlong",
        "outfilename": "sacramento.json",
    },
]

for file in files:

    infilename = os.path.join('input', file['folder'], file['shapefile'])

    sf = shapefile.Reader(infilename)
    records = sf.shapeRecords()
    geojson = records.__geo_interface__

    for f in geojson['features']:

        new_props = {}

        for p in f['properties']:

            if p in needed_fields:
                new_props[p] = f['properties'][p]

        f['properties'] = new_props

    json.dump(geojson, open(os.path.join('output', file['outfilename']), 'w'))

