import csv
import os
import json

data = {}

categories_filename = 'infrastructure_element_categories.csv'
categories_path = os.path.join('output', categories_filename)

with open(categories_path) as infile:
    reader = csv.reader(infile)
    headers = next(reader)
    for r in reader:

        shortname = r[headers.index('shortname')]

        data[shortname] = {
            'label': r[headers.index('category')],
            'shortname': shortname,
            'tooltip': r[headers.index('tooltip')],
            'items': []
        }

elements_filename = 'infrastructure_elements.csv'
elements_path = os.path.join('output', elements_filename)

with open(elements_path) as infile:
    reader = csv.reader(infile)
    headers = next(reader)
    for r in reader:
        data[r[headers.index('category')]]['items'].append({
            'label': r[headers.index('element')],
            'shortname': r[headers.index('shortname')],
            'description': r[headers.index('description')],
            'units': r[headers.index('units')],
            'calc_units': r[headers.index('calc_units')],
        })

output = {
    'categories': [],
}

for category in data:
    output['categories'].append(data[category])

outfile_path = os.path.join('output', 'infrastructure.json')
json.dump(output, open(outfile_path, 'w'))
