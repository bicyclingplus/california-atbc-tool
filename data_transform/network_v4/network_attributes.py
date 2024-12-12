import json
import os

def props(infilepath, outfilepath):

    if not os.path.exists(outfilepath):

        print(f"loading {infilepath}")

        uprops = []
        injson = json.load(open(infilepath))

        print("analyzing")

        for f in injson["features"]:

            for k in f['properties'].keys():
                if k not in uprops:
                    uprops.append(k)

        with open(outfilepath, 'w') as outfile:
            for p in uprops:
                outfile.write(f"{p}\n")

    else:
        print(f"skipping {infilepath}")

wayfile = "output/Study_Area_Bike_Output_job_pop_v9.geojson"
intfile = "input/Study_Area_Ped_Output_job_pop_v10.geojson"

wayout = 'output/wayprops.txt'
intout = 'output/intprops.txt'

props(wayfile, wayout)
props(intfile, intout)
