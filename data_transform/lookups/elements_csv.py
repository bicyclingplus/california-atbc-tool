import json
import os
import csv

outfilename = 'elements.csv'
outfilepath = os.path.join('output', outfilename)

infilepath = '../../server/data/infrastructure.json'

elements = json.load(open(infilepath))

output = []

for category in elements['categories']:

    for item in category['items']:

        output.append((
            item['shortname'],
            category['label'],
            item['label'],
            item['units'],
            item['calc_units'],
        ))

with open(outfilepath, 'w') as outfile:

    writer = csv.writer(outfile)

    writer.writerow([
        'element',
        'category',
        'label',
        'units',
        'calc_units',
    ])

    for row in output:
        writer.writerow(row)
