import json
import os
import csv

outfilename = 'qualitative.csv'
outfilepath = os.path.join('output', outfilename)

infilepath = '../../server/data/qualitative.json'

elements = json.load(open(infilepath))

output = []

for item in elements:

    for benefit in elements[item]:

        output.append((
            item,
            benefit['description'],
            benefit['sources'],
        ))

with open(outfilepath, 'w') as outfile:

    writer = csv.writer(outfile)

    writer.writerow([
        'element',
        'description',
        'sources',
    ])

    for row in output:
        writer.writerow(row)
