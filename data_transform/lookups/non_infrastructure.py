# TODO take non_infrastructure_elements.csv and create non_infrastructure.json
import csv
import os
import json

data = []

non_filename = 'non_infrastructure_elements.csv'
non_path = os.path.join('output', non_filename)
with open(non_path) as infile:
    reader = csv.reader(infile)
    headers = next(reader)
    for r in reader:
        data.append({
            'label': r[headers.index('element')],
            'shortname': r[headers.index('shortname')],
            'description': r[headers.index('description')],
        })

output = {
    'items': data,
}

outfile_path = os.path.join('output', 'non_infrastructure.json')
json.dump(output, open(outfile_path, 'w'))
