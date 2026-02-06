import json
import os
import csv

outfilename = 'infrastructure_element_categories.csv'
outfilepath = os.path.join('output', outfilename)

infilepath = '../../server/data/infrastructure.json'

elements = json.load(open(infilepath))

output = []

for category in elements['categories']:

    output.append([
        category['label'],
        category['shortname'],
        category['tooltip'],
    ])

with open(outfilepath, 'w') as outfile:

    writer = csv.writer(outfile)

    writer.writerow([
        'category',
        'shortname',
        'tooltip',
    ])

    for row in output:
        writer.writerow(row)
