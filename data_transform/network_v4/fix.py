import json
import os

print('Starting ways')

way_files = [
    "Study_Area_Bike_Output_job_pop_v9.geojson",
]

bad_pop = 0

for file in way_files:
    geojson = json.load(open(os.path.join('input', file)))

    for f in geojson['features']:

        # bike_demand {"year" => string} {"year" => float}
        # for b in f['properties']['bike_demand']:
        #     b_val = float(f['properties']['bike_demand'][b])
        #     f['properties']['bike_demand'][b] = b_val

        # population string -> int
        # try:
        #     pop_val = int(f['properties']['population'])
        #     f['properties']['population'] = pop_val
        # except ValueError:
        #     bad_pop += 1

        f['properties']['bicyclist_demand'] = f['properties']['bike_demand']
        del f['properties']['bike_demand']

    json.dump(geojson, open(os.path.join('output', file), 'w'))

# print(f"{bad_pop} features had a bad value for population")

# print('Starting intersections')

# intersection_files = [
#     'Study_Area_Ped_Output_job_pop_v4.geojson',
# ]

# for file in intersection_files:

#     geojson = json.load(open(os.path.join('input', file)))

#     for f in geojson['features']:

#         # ped_demand {"year" => string} {"year" => float}
#         for b in f['properties']['ped_demand']:
#             b_val = float(f['properties']['ped_demand'][b])
#             f['properties']['ped_demand'][b] = b_val

#         # population string -> int
#         job_val = int(f['properties']['jobs'])
#         f['properties']['jobs'] = job_val

#         # population string -> int
#         pop_val = int(f['properties']['population'])
#         f['properties']['population'] = pop_val

#     json.dump(geojson, open(os.path.join('output', file), 'w'))