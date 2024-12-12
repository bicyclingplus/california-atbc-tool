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

wayfile = "output/2022_07_30_Final_network_links_merged.geojson"
intfile = "input/2022_07_30_Final_network_nodes.geojson"

wayout = 'output/wayprops.txt'
intout = 'output/intprops.txt'

props(wayfile, wayout)
props(intfile, intout)
