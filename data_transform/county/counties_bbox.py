import os
import csv
import json

from operator import itemgetter

infilename = 'California_county_bbox.csv'
outfilename = 'counties.json'
counties = {
    "counties": []
}

with open(os.path.join('input', infilename)) as infile:

    reader = csv.reader(infile)

    next(reader) # headers

    for r in reader:

        counties['counties'].append({
            'name': r[1],
            'xmin': float(r[2]),
            'ymin': float(r[3]),
            'xmax': float(r[4]),
            'ymax': float(r[5]),
        })

counties['counties'] = sorted(counties['counties'], key=itemgetter('name'))

json.dump(counties, open(os.path.join('output', outfilename), 'w'))
