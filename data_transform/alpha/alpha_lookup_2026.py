import os
import csv
import json
import math

infilenames = [
    'appendix_a_links.csv',
    'appendix_a_nodes.csv',
]

output = {}

functional_mapping = {
    "local road": "local",
    "minor road": "minor_road",
    "major road": "major_road",
}

for infilename in infilenames:

    with open(os.path.join('input', infilename)) as infile:

        reader = csv.reader(infile)

        headers = next(reader)

        for r in reader:

            # mojvf

            mode = r[1].lower()
            location_type = r[0].lower()
            exposure_class = r[2].lower()
            functional_class = functional_mapping[r[3].lower()]

            volume = float(r[5])
            crash_risk = float(r[6])
            injury_risk = float(r[7])
            death_risk  = float(r[8])

            current_outcomes = {
                'crash': float(r[9]),
                'injury': float(r[10]),
                'death': float(r[11]),
            }

            if mode not in output:
                output[mode] = {}

                for o in current_outcomes:
                    output[mode][o] = {}

            for o in current_outcomes:
                if location_type not in output[mode][o]:
                    output[mode][o][location_type] = {}

            for o in current_outcomes:
                if exposure_class not in output[mode][o][location_type]:
                    output[mode][o][location_type][exposure_class] = {}

            for o in current_outcomes:
                output[mode][o][location_type][exposure_class][functional_class] = current_outcomes[o]


output['bicycling'] = output['bike']
output['walking'] = output['walk']

del output['bike']
del output['walk']

json.dump(output, open(os.path.join('output', 'alpha_lookup.json'), 'w'))
