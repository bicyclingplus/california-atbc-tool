import csv
import os
import json

data = {}

filename = 'qualitative.csv'
path = os.path.join('output', filename)
with open(path) as infile:
    reader = csv.reader(infile)
    headers = next(reader)
    for r in reader:

        element = r[headers.index('element')]

        if element not in data:
            data[element] = []

        data[element].append({
            'description': r[headers.index('description')],
            'sources': r[headers.index('sources')],
        })

outfile_path = os.path.join('output', 'qualitative.json')
json.dump(data, open(outfile_path, 'w'))
