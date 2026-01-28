import os
import csv
import json

input_file = 'IHME-GBD_2023_DATA-bike-ped.csv'
output_file = 'bike_ped_burden.json'

data = {}
transformed = {}

# load csv to dictionary
with open(os.path.join('input', input_file)) as infile:
    reader = csv.reader(infile)
    headers = next(reader)

    for r in reader:

        cause = r[headers.index('cause')]
        age = r[headers.index('age')]
        sex = r[headers.index('sex')]
        measure = r[headers.index('measure')]
        val = float(r[headers.index('val')])

        if cause not in data:
            data[cause] = {}

        if age not in data[cause]:
            data[cause][age] = {}

        if sex not in data[cause][age]:
            data[cause][age][sex] = {}

        data[cause][age][sex][measure] = val

# precalculate lookup dictionary for backend
for cause in data:
    for age in data[cause]:
        for sex in data[cause][age]:

            if cause not in transformed:
                transformed[cause] = {}

            if age not in transformed[cause]:
                transformed[cause][age] = {}

            dalys_key = "DALYs (Disability-Adjusted Life Years)"
            dalys = data[cause][age][sex][dalys_key]

            # assume incidence of zero if a row did not exist
            # for a paticular cause/age/sex
            try:
                incidence = data[cause][age][sex]["Incidence"]
            except KeyError:
                incidence = 0

            # default to zero in the case of division by zero
            daly_per_case = dalys / incidence if incidence > 0 else 0

            transformed[cause][age][sex] = {
                'daly_per_case': daly_per_case,
                'incidence': incidence,
            }

json.dump(transformed, open(os.path.join('output', output_file), 'w'))
