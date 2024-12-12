import csv
import os
import json

infilename = 'CA_County_Fleetdatabase.csv'
outfilename = 'fleet_makeup.json'
fleet_makeup = {}

with open(os.path.join('input', infilename)) as infile:

    reader = csv.reader(infile)

    next(reader) # headers

    for r in reader:

        # columns of interest
        fuel = r[1]
        county = r[2]
        count = int(r[3])

        if county not in fleet_makeup:

            # prefill all of these because some counties
            # don't have counts for all vehicle types
            fleet_makeup[county] = {
                "Diesel": 0,
                "Gasoline": 0,
                "Plug-in Hybrid": 0,
                "Total": 0,
            }

        fleet_makeup[county]['Total'] += count

        # standardize to match the emissions table
        if fuel == 'Plug-In Hybrid':
            fuel = 'Plug-in Hybrid'

        # we don't care about the individual electric count
        # because all of the emissions numbers are 0 for it
        if fuel != 'Electric':
            fleet_makeup[county][fuel] = count


json.dump(fleet_makeup, open(os.path.join('output', outfilename), 'w'))
