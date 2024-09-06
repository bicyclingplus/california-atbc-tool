import os
import csv
import json

import csv
import os
import json

infilename = 'county-list.csv'
outfilename = 'counties.json'
counties = {
    "counties": []
}

with open(os.path.join('input', infilename)) as infile:

    reader = csv.reader(infile)

    next(reader) # headers

    for r in reader:

        # columns of interest
        county = r[1]

        counties['counties'].append(county)


json.dump(counties, open(os.path.join('output', outfilename), 'w'))
