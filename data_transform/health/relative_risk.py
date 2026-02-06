import json
import os
import csv

data = {}

with open(os.path.join('input', 'ITHIM_RR_TABLE.csv')) as infile:
    reader = csv.reader(infile)
    headers = next(reader)
    for r in reader:
        rr = float(r[headers.index('RR_per_unit')])
        data[r[headers.index('cause_name')]] = rr

json.dump(data, open(os.path.join('output', 'relative_risk.json'), 'w'))
