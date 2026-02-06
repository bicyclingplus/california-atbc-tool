import os
import csv
import json

data = {}

with open(os.path.join('output', 'project_qualitative.csv')) as infile:
    reader = csv.reader(infile)
    headers = next(reader)
    for r in reader:

        benefit_name = r[headers.index('name')]
        benefit_type = r[headers.index('type')]

        parent = r[headers.index('parent')]

        data[benefit_name] = {
            'name': benefit_name,
            'type': benefit_type,
            'parent': parent if parent != '' else None,
            'elements': [],
        }

        if benefit_type == 'always':
            data[benefit_name]['description'] = r[headers.index('description')]

        else:
            data[benefit_name]['description'] = {
                'present': r[headers.index('present')],
                'not-present': r[headers.index('not_present')],
            }

with open(os.path.join('output', 'project_qualitative_elements.csv')) as infile:
    reader = csv.reader(infile)
    headers = next(reader)
    for r in reader:
        data[r[headers.index('benefit')]]['elements'].append(r[headers.index('element')])

output = {
    'benefits': []
}

for benefit in data:
    output['benefits'].append(data[benefit])

outfile_path = os.path.join('output', 'project_qualitative.json')
json.dump(output, open(outfile_path, 'w'))
