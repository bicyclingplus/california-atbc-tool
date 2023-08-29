import csv
import os

infolder = 'input'
outfolder = 'output'

files = [
    {
        'name': 'Small Urban and Rural ATP Projects List - MPO Recommendations.csv',
        'idcolname': 'Project ID',
    },
    {
        'name': 'Small Urban and Rural ATP Projects List - SW + SUR Data Only.csv',
        'idcolname': 'Project ID (most up to date)',
    },
]

pids = []

for f in files:

    infilepath = os.path.join(infolder, f['name'])

    with open (infilepath) as infile:

        reader = csv.reader(infile)
        headers = next(reader)
        idcolidx = headers.index(f['idcolname'])

        for r in reader:
            pid = r[idcolidx]

            if pid == '':
                continue

            if pid == '///':
                continue

            if pid == 'flag':
                continue

            if 'Project ID: ' in pid:
                pid = pid.replace('Project ID: ', '')

            if pid == '---':
                continue

            pids.append(pid)

unique = set(pids)

outfilepath = os.path.join(outfolder, 'unique_project_ids.csv')

with open(outfilepath, 'w') as outfile:
    writer = csv.writer(outfile)

    writer.writerow(['Project ID'])

    for pid in unique:
        writer.writerow([pid])
