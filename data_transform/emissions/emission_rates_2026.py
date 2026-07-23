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

infilename = 'EMFAC_BCtool_format.csv'
outfilename = 'emission_rates.json'
emissions = {}

with open(os.path.join('input', infilename)) as infile:

    reader = csv.reader(infile)

    headers = next(reader)

    county_idx = headers.index('Region')
    year_idx = headers.index('Calendar Year')
    vehicle_type_idx = headers.index('Fuel')
    vehicle_cat_idx = headers.index('Vehicle Category')

    emissions_idx = [headers.index("{}_RUNEX".format(e))
        for e in emissions_types]

    for r in reader:

        county = r[county_idx]
        year = r[year_idx]
        vehicle_type = r[vehicle_type_idx]
        vehicle_cat = r[vehicle_cat_idx]

        if vehicle_cat != "LDA":
            continue

        # skip, always zero
        if vehicle_type == 'Electricity':
            continue

        if vehicle_type == 'Fuel Cell Electric Vehicle':
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

# SANITY CHECKS BELOW

print(f"counties: {len(emissions.keys())}")

num_years = None

for county in emissions:
    if num_years is None:
        num_years = len(emissions[county].keys())
    elif num_years != len(emissions[county].keys()):
        print(f"MISMATCH {county} {len(emissions[county].keys())}")

print(f"years: {num_years}")

num_types = None

for county in emissions:

    for year in emissions[county]:

        curr = len(emissions[county][year].keys())

        if num_types is None:
            num_types = curr
        elif num_types != curr:
            print(f"TYPE MISMATCH {county} {year} {curr}")

print(f"types: {num_types}")


num_emissions = None

for county in emissions:

    for year in emissions[county]:

        for vtype in emissions[county][year]:


            curr = len(emissions[county][year][vtype].keys())

            if num_emissions is None:
                num_emissions = curr
            elif num_emissions != curr:
                print(f"EMISSIONS MISMATCH {county} {year} {vtype} {curr}")

print(f"emissions: {num_emissions}")
