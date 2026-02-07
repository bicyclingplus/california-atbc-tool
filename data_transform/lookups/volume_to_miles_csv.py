import json
import os
import csv

outfilename = 'volume_to_miles.csv'
outfilepath = os.path.join('output', outfilename)

infilepath = '../../server/data/volume_to_miles.json'

data = json.load(open(infilepath))

output = []

for mode in data:

    for dist in data[mode]:

        output.append((
            mode,
            dist,
            data[mode][dist]
        ))

with open(outfilepath, 'w') as outfile:

    writer = csv.writer(outfile)

    writer.writerow([
        'mode',
        'distance',
        'distribution',
    ])

    for row in output:
        writer.writerow(row)
