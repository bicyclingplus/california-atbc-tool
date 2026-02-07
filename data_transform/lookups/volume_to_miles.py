import csv
import os
import json

data = {}

filename = 'volume_to_miles.csv'
path = os.path.join('output', filename)
with open(path) as infile:
    reader = csv.reader(infile)
    headers = next(reader)
    for r in reader:

        mode = r[headers.index('mode')]
        dist = r[headers.index('distance')]

        if mode not in data:
            data[mode] = {}

        data[mode][dist] = float(r[headers.index('distribution')])

outfile_path = os.path.join('output', 'volume_to_miles.json')
json.dump(data, open(outfile_path, 'w'))
