import os
import json
import csv

input_file = 'clean_acs_lifeExpectancy_data.csv'
output_file = 'life_expectancy.json'

data = {}

with open(os.path.join('input', input_file)) as infile:
    reader = csv.reader(infile)
    headers = next(reader)
    for r in reader:

        county = r[headers.index('County')]

        if county in data:
            continue

        life_expectancy = float(r[headers.index('Life Expectancy')])
        data[county] = life_expectancy

json.dump(data, open(os.path.join('output', output_file), 'w'))

