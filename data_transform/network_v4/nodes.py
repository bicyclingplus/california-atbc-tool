import csv
import os
import json
from tqdm import tqdm

geojson_infilename = "Study_Area_Bike_Output_job_pop_v9.geojson"
geojson_outfilename = "Study_Area_Bike_Output_job_pop_v9_merged.geojson"
node_infilename = "study_area_start_end_nodes_v2.csv"

node_data = {}

print('Loading src/tgt node data')

with open(os.path.join('input', node_infilename)) as infile:

    reader = csv.reader(infile)

    # edge_uid,source,target

    next(reader)

    for r in reader:

        try:
            src = int(r[1])

            # It appears 9 links have "NA" as dest id
            # dest = int(r[4])
            dest = int(r[2]) if r[2] != 'NA' else None
        except ValueError:
            print(r)
            exit()

        node_data[int(r[0])] = (src, dest)

print('Loaded')

print('Loading src geojson')

geojson = json.load(open(os.path.join('output', geojson_infilename)))

print('Loaded')



for f in tqdm(geojson['features']):

    m = node_data[f['properties']['edge_uid']]
    f['properties']['source'] = m[0]
    f['properties']['target'] = m[1]

print('Dumping new geojson')

json.dump(geojson, open(os.path.join('output', geojson_outfilename), 'w'))
