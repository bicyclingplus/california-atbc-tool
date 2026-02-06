import csv
import os
import json

infilepath = os.path.join(
    '..',
    '..',
    'server',
    'data',
    'project_qualitative.json',
)

data = json.load(open(infilepath))

benefits = []
elements = []

for benefit in data['benefits']:

    parent = ''

    if benefit['parent'] is not None:
        parent = benefit['parent']

    desc = ''
    present = ''
    not_present = ''


    if isinstance(benefit['description'], str):
        desc = benefit['description']
    else:
        present = benefit['description']['present']
        not_present = benefit['description']['not-present']

    benefits.append([
        benefit['name'],
        benefit['type'],
        parent,
        desc,
        present,
        not_present,
    ])

    for element in benefit['elements']:
        elements.append([
            benefit['name'],
            element,
        ])

with open(os.path.join('output', 'project_qualitative.csv'), 'w') as outfile:
    writer = csv.writer(outfile)
    writer.writerow([
        'name',
        'type',
        'parent',
        'description',
        'present',
        'not_present',
    ])
    for r in benefits:
        writer.writerow(r)

elements_path = os.path.join('output', 'project_qualitative_elements.csv')
with open(elements_path, 'w') as outfile:
    writer = csv.writer(outfile)
    writer.writerow([
        'benefit',
        'element',
    ])
    for r in elements:
        writer.writerow(r)
