import os
import csv
import json

emissions_types = [
    "NOx",
    "PM2.5",
    "PM10",
    "CO2",
    "CH4",
    "N2O",
    "NH3",
    "CO",
    "SOx",
]

infilename = 'CA_County_EMFAC.csv'
outfilename = 'emission_rates.json'
emissions = {}

with open(os.path.join('input', infilename)) as infile:

    reader = csv.reader(infile)

    headers = next(reader)

    county_idx = headers.index('Region')
    year_idx = headers.index('Calendar Year')
    vehicle_type_idx = headers.index('Fuel')

    emissions_idx = [headers.index("{}_RUNEX".format(e))
        for e in emissions_types]

    for r in reader:

        county = r[county_idx]
        year = r[year_idx]
        vehicle_type = r[vehicle_type_idx]

        # skip, always zero
        if vehicle_type == 'Electricity':
            continue

        if county not in emissions:
            emissions[county] = {}

        if year not in emissions[county]:
            emissions[county][year] = {}

        if vehicle_type not in emissions[county][year]:
            emissions[county][year][vehicle_type] = {}

        for e,i in zip(emissions_types, emissions_idx):
            emissions[county][year][vehicle_type][e] = float(r[i])

json.dump(emissions, open(os.path.join('output', outfilename), 'w'))



