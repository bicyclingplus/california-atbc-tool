import csv
import json
import os

input_file = 'SCC_Table_2021_2050_2pct_growth.csv'
output_file = 'ghg_monetary.json'

data = {}

with open(os.path.join('input', input_file)) as infile:
    reader = csv.reader(infile)
    headers = next(reader)
    for r in reader:
        year = r[headers.index('year')]
        rate = float(r[headers.index('SCC_USD_per_ton')])
        data[year] = rate

json.dump(data, open(os.path.join('output', output_file), 'w'))
