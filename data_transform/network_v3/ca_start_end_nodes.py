import csv
import os
import json
from tqdm import tqdm

gejson_infilename = "2022_07_30_Final_network_links.geojson"
gejson_outfilename = "2022_07_30_Final_network_links_merged.geojson"
node_infilename = "California_start_end_nodes.csv"

node_data = {}

print('Loading src/tgt node data')

with open(os.path.join('input', node_infilename)) as infile:

    reader = csv.reader(infile)

    # headers (* of interest)
    # row count, edgeUID*, osmId, source*, target*

    next(reader)

    for r in reader:

        try:
            src = int(r[3])

            # It appears 9 links have "NA" as dest id
            # dest = int(r[4])
            dest = int(r[4]) if r[4] != 'NA' else None
        except ValueError:
            print(r)
            exit()

        node_data[int(r[1])] = (src, dest)

print('Loaded')

print('Loading src geojson')

geojson = json.load(open(os.path.join('input', gejson_infilename)))

print('Loaded')



for f in tqdm(geojson['features']):

    m = node_data[f['properties']['edge_uid']]
    f['properties']['source'] = m[0]
    f['properties']['target'] = m[1]

print('Dumping new geojson')

json.dump(geojson, open(os.path.join('output', gejson_outfilename), 'w'))
