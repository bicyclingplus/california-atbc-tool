import json
import os
import csv

outfilename = 'infrastructure_elements.csv'
outfilepath = os.path.join('output', outfilename)

infilepath = '../../server/data/infrastructure.json'

elements = json.load(open(infilepath))

output = []

for category in elements['categories']:

    for item in category['items']:

        output.append((
            item['label'],
            category['shortname'],
            item['shortname'],
            item['description'],
            item['units'],
            item['calc_units'],
        ))

with open(outfilepath, 'w') as outfile:

    writer = csv.writer(outfile)

    writer.writerow([
        'element',
        'category',
        'shortname',
        'description',
        'units',
        'calc_units',
    ])

    for row in output:
        writer.writerow(row)
