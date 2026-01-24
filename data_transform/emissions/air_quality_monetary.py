import csv
import json
import os

input_file = 'PM25_ITHIM_full_interpolated_2020_2050.csv'
output_file = 'air_quality_monetary.json'

data = {}

with open(os.path.join('input', input_file)) as infile:
	reader = csv.reader(infile)
	headers = next(reader)
	for r in reader:
		year = r[headers.index('year')]
		rate = float(r[headers.index('pm25_mortality_per_ton')])
		data[year] = rate

json.dump(data, open(os.path.join('output', output_file), 'w'))
