import csv
import os
import json

data = {}

filename = 'travel_volume.csv'
path = os.path.join('output', filename)
with open(path) as infile:
    reader = csv.reader(infile)
    headers = next(reader)
    for r in reader:

        element = r[headers.index('element')]
        mode = r[headers.index('mode')]

        if element not in data:
            data[element] = {}

        data[element][mode] = {
            'lower': float(r[headers.index('lower')]),
            'mean': float(r[headers.index('mean')]),
            'upper': float(r[headers.index('upper')]),
        }

outfile_path = os.path.join('output', 'travel_volume.json')
json.dump(data, open(outfile_path, 'w'))
