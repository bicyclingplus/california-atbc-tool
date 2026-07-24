import json
import os

infilename = 'links.geojson'
infilepath = os.path.join('input', infilename)

geojson = json.load(open(infilepath))

for i in range(1):
    print(json.dumps(geojson['features'][i]))


infilename = 'nodes.geojson'
infilepath = os.path.join('input', infilename)

geojson = json.load(open(infilepath))

for i in range(1):
    print(json.dumps(geojson['features'][i]))

infilename = 'context_blocks.geojson'
infilepath = os.path.join('input', infilename)

geojson = json.load(open(infilepath))

for i in range(1):
    print(json.dumps(geojson['features'][i]))