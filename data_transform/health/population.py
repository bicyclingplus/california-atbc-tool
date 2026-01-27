import os
import json
import csv

input_file = 'clean_acs_lifeExpectancy_data.csv'
output_file = 'population.json'

# needed columns
# GEO_ID
# age
# sex
# population

sexes = [
    "Male",
    "Female",
]

ages = [
    "<5 years",
    "5-9 years",
    "10-14 years",
    "15-19 years",
    "20-24 years",
    "25-29 years",
    "30-34 years",
    "35-39 years",
    "40-44 years",
    "45-49 years",
    "50-54 years",
    "55-59 years",
    "60-64 years",
    "65-69 years",
    "70-74 years",
    "75-79 years",
    "80-84 years",
    "85+ years",
]

data = {}

with open(os.path.join('input', input_file)) as infile:
    reader = csv.reader(infile)
    headers = next(reader)
    for r in reader:

        geoid = r[headers.index('GEO_ID')]

        data[geoid] = {}

        for age in ages:

            if age not in data[geoid]:
                data[geoid][age] = {}

            for sex in sexes:
                pop = int(r[headers.index(f"{sex} {age}")])

                data[geoid][age][sex] = pop

json.dump(data, open(os.path.join('output', output_file), 'w'))

