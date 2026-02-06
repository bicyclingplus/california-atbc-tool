import json
import os
import csv

outfilename = 'non_infrastructure_elements.csv'
outfilepath = os.path.join('output', outfilename)

infilepath = '../../server/data/non_infrastructure.json'

elements = json.load(open(infilepath))

output = []

for item in elements['items']:

    output.append((
        item['label'],
        item['shortname'],
        item['description'],
    ))

with open(outfilepath, 'w') as outfile:

    writer = csv.writer(outfile)

    writer.writerow([
        'element',
        'shortname',
        'description',
    ])

    for row in output:
        writer.writerow(row)
