import json
import os
import csv

outfilename = 'quantitative.csv'
outfilepath = os.path.join('output', outfilename)

infilepath = '../../server/data/quantitative.json'

elements = json.load(open(infilepath))

output = []

for item in elements:

    for benefit in elements[item]:

        output.append((
            item,
            benefit['mode'],
            benefit['outcome'],
            benefit['location_type'],
            benefit['lower'],
            benefit['mean'],
            benefit['upper'],
        ))

with open(outfilepath, 'w') as outfile:

    writer = csv.writer(outfile)

    writer.writerow([
        'element',
        'mode',
        'outcome',
        'location',
        'lower',
        'mean',
        'upper',
    ])

    for row in output:
        writer.writerow(row)
