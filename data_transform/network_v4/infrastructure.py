def map_elements(original):

    if original == 'ada_ramp':
        return 'ada-ramps'

    if original == 'ada-ramp':
        return 'ada-ramps'

    if original == 'bike_blvd':
        return 'bike-boulevard'

    if original == 'bike_box':
        return 'bike-box'

    if original == 'buff_bike_lane':
        return 'buffered-bike-lane'

    if original == 'conv_bike_lane':
        return 'conventional-bike-lane'

    if original == 'curb_ext':
        return 'curb-extension'

    if original == 'flash_beac':
        return 'flashing-beacon'

    if original == 'off_street_paths':
        return 'off-street-multi-use-or-bike-path'

    if original == 'ped_cross_island':
        return 'crossing-island'

    if original == 'prot_bike_lane':
        return 'protected-bike-lane'

    if original == 'raised_cross':
        return 'raised-crossing'

    if original == 'road_diet':
        return 'road-diet'

    if original == 'traffic_signal':
        return 'traffic-signal'

    return original

import csv
import os

data = []

filename = 'infrastructure.csv'
current = '2024_12_11'
src = os.path.join('input', current)
dest = os.path.join('output', current)

if not os.path.exists(dest):
    os.mkdir(dest)

# open infrastructure file from input
with open(os.path.join(src, filename)) as infile:
    reader = csv.reader(infile)
    headers = next(reader)
    for r in reader:
        data.append(r)

for r in data:
    r[1] = map_elements(r[1])

with open(os.path.join(dest, filename), 'w') as outfile:
    writer = csv.writer(outfile)
    writer.writerow(headers)
    for r in data:
        writer.writerow(r)


# map each infrastructure name to a valid one

# write updated file in output