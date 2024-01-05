import os
import csv
import json
import math

infilename = 'systemic_risk_clean.csv'

output = {}

SAFETY_IN_NUMBERS = 0.5

def calc_alpha(risk, volume):
    return math.log(
        risk /
        pow(volume, SAFETY_IN_NUMBERS)
    )

with open(os.path.join('input', infilename)) as infile:

    reader = csv.reader(infile)

    headers = next(reader)

    for r in reader:

        # mojvf

        mode = r[1].lower()
        location_type = r[0].lower()
        exposure_class = r[2].lower()
        functional_class = r[3].lower()

        volume = float(r[5])
        crash_risk = float(r[6])
        injury_risk = float(r[7])
        death_risk  = float(r[8])

        current_outcomes = {
            'crash': calc_alpha(crash_risk, volume),
            'injury': calc_alpha(injury_risk, volume),
            'death': calc_alpha(death_risk, volume),
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

output['combined'] = {}

for outcome in ['crash', 'injury', 'death']:

    if outcome not in output['combined']:
        output['combined'][outcome] = {}

    for location_type in ['intersection', 'roadway']:

        if location_type not in output['combined'][outcome]:
            output['combined'][outcome][location_type] = {}

        for volume in ['low', 'medium', 'high']:

            if volume not in output['combined'][outcome][location_type]:
                output['combined'][outcome][location_type][volume] = {}

            for functional_class in ['local', 'minor_road', 'major_road']:

                output['combined'][outcome][location_type][volume][functional_class] = (
                    (output['walking'][outcome][location_type][volume][functional_class] +
                        output['bicycling'][outcome][location_type][volume][functional_class])
                    / 2
                )


json.dump(output, open(os.path.join('output', 'alpha_lookup.json'), 'w'))

