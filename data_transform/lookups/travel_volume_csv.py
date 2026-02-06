import json
import os
import csv

outfilename = 'travel_volume.csv'
outfilepath = os.path.join('output', outfilename)

infilepath = '../../server/data/travel_volume.json'

elements = json.load(open(infilepath))

output = []

for element in elements:

    for mode in elements[element]:

        output.append((
            element,
            mode,
            elements[element][mode]['lower'],
            elements[element][mode]['mean'],
            elements[element][mode]['upper'],
        ))

with open(outfilepath, 'w') as outfile:

    writer = csv.writer(outfile)

    writer.writerow([
        'element',
        'mode',
        'lower',
        'mean',
        'upper',
    ])

    for row in output:
        writer.writerow(row)
