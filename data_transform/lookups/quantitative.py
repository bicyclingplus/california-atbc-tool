import csv
import os
import json

data = {}

filename = 'quantitative.csv'
path = os.path.join('output', filename)
with open(path) as infile:
    reader = csv.reader(infile)
    headers = next(reader)
    for r in reader:

        element = r[headers.index('element')]

        if element not in data:
            data[element] = []

        data[element].append({
            'mode': r[headers.index('mode')],
            'outcome': r[headers.index('outcome')],
            'location_type': r[headers.index('location')],
            'lower': float(r[headers.index('lower')]),
            'mean': float(r[headers.index('mean')]),
            'upper': float(r[headers.index('upper')]),
        })

outfile_path = os.path.join('output', 'quantitative.json')
json.dump(data, open(outfile_path, 'w'))
