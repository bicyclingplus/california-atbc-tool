import csv
import os
import json
from pymongo import MongoClient
from tqdm import tqdm

client = MongoClient("mongodb://bctool:phev@localhost:27017")
dbname = client['bctool']

src = 'input'

# get list of project ids
# make sure there are no duplicate project ids
project_ids = []

with open(os.path.join(src, 'projects.csv')) as infile:

    reader = csv.reader(infile)

    next(reader)

    for r in reader:

        project_id = r[1]

        if project_id in project_ids:
            print(f"DUPLICATE PROJECT ID {project_id}")
            continue

        project_ids.append(project_id)

# make sure every segment/intersection references a valid project id
segments = {}

for project_id in project_ids:
    segments[project_id] = []

with open(os.path.join(src, 'segments.csv')) as infile:
    reader = csv.reader(infile)
    next(reader)
    for r in reader:
        project_id = r[0]

        if project_id not in project_ids:
            print(f"BAD PROJECT ID {project_id} IN SEGMENTS")
            continue

        segments[project_id].append(int(r[1]))

intersections = {}

for project_id in project_ids:
    intersections[project_id] = []

with open(os.path.join(src, 'intersections.csv')) as infile:
    reader = csv.reader(infile)
    next(reader)
    for r in reader:
        project_id = r[0]

        if project_id not in project_ids:
            print(f"BAD PROJECT ID {project_id} IN INTERSECTIONS")
            continue

        intersections[project_id].append(int(r[1]))

# make sure every project has at least 1 intersection/segment
for project_id in project_ids:

    if not len(segments[project_id]) and not len(intersections[project_id]):
        print(f"PROJECT {project_id} HAS NO NETWORK SELECTIONS")

# make sure all segment/intersections are valid edge_uid / node_id
collection_name = dbname['ways_v4_partial']

edge_udis = []
for project_id in project_ids:
    for segment in segments[project_id]:
        edge_udis.append(segment)

bad_edge_uids = []

for edge_uid in tqdm(edge_udis):

    result = collection_name.find_one({
        'properties.edge_uid': edge_uid,
    })

    if not result:
        bad_edge_uids.append(edge_uid)

if len(bad_edge_uids):
    for edge_uid in bad_edge_uids:
        print(f"BAD EDGE_UID {edge_uid}")

    print(f"NUMBER OF BAD EDGE_UIDS {len(bad_edge_uids)} / {len(edge_udis)}")

collection_name = dbname['intersections_v4_partial']

node_ids = []
for project_id in project_ids:
    for node_id in intersections[project_id]:
        node_ids.append(node_id)

bad_node_ids = []

for node_id in tqdm(node_ids):

    result = collection_name.find_one({
        'properties.node_id': node_id,
    })

    if not result:
        bad_node_ids.append(node_id)

if len(bad_node_ids):
    # for node_id in bad_node_ids:
    #     print(f"BAD NODE_ID {node_id}")

    print(f"NUMBER OF BAD NODE_IDS {len(bad_node_ids)} / {len(node_ids)}")

# make sure all infrastructure element names are valid
infrastructure = {}

for project_id in project_ids:
    infrastructure[project_id] = {}

with open(os.path.join('output', 'infrastructure.csv')) as infile:
    reader = csv.reader(infile)
    next(reader)
    for r in reader:
        project_id = r[0]
        element = r[1]
        new = float(r[2])
        upgrade = float(r[3])
        retrofit = float(r[4])

        infrastructure[project_id][element] = {
            "new": new,
            "upgrade": upgrade,
            "retrofit": retrofit,
        }

# make sure all infrastructure element values are valid numbers

infrastructure_data = json.load(open(os.path.join(
    '/',
    'home',
    'matthew',
    'repos',
    'caltrans-bc-tool',
    'server',
    'data',
    'infrastructure.json',
)))

infrastructure_names = []

for category in infrastructure_data['categories']:
    for item in category['items']:
        infrastructure_names.append(item['shortname'])

total_names = 0
bad_names = 0

for project_id in project_ids:
    for element in infrastructure[project_id]:
        total_names += 1
        if element not in infrastructure_names:
            # print(f"BAD INFRASTRUCTURE ELEMENT {element}")
            bad_names += 1

if bad_names:
    print(f"NUMBER OF BAD INFRASTRUCTURE NAMES {bad_names} / {total_names}")

effective = {}

# make sure all infrastructure elements have a least one value
no_effect = 0
for project_id in project_ids:
    effective[project_id] = []
    for element in infrastructure[project_id]:
        if not any(infrastructure[project_id][element].values()):
            # print(f"INFRASTRUCTURE ELEMENT WITH NO EFFECT {element}")
            no_effect += 1
        else:
            effective[project_id].append(element)

if no_effect:
    print(f"NUMBER OF INFRASTRUCTURE ELEMENTS WITH NO EFFECT {no_effect} / {total_names}")


travel_data = json.load(open(os.path.join(
    '/',
    'home',
    'matthew',
    'repos',
    'caltrans-bc-tool',
    'server',
    'data',
    'travel_volume.json',
)))

no_benefit = 0
for project_id in project_ids:

    if not len(effective[project_id]):
        continue

    has_benefit = [
        el for el in effective[project_id]
        if el in list(travel_data.keys())
    ]

    # print(has_benefit)
    # exit()

    if not len(has_benefit):
        no_benefit += 1

if no_benefit:
    print(f"NUMBER OF PROJECTS WITH NO BENEFITS {no_benefit} / {len(project_ids)}")
