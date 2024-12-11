# i want to know for each attribute
# number of features by attribute's type (string/number/null)
import csv
from pymongo import MongoClient

client = MongoClient("mongodb://bctool:phev@localhost:27017")
db = client['bctool']

types = [
    "string",
    "null",
    "double",
    "int",
    "long",
    # "Decimal128",
]

def propcnt(coll, infilepath, outfilepath):

    print(f"starting {infilepath}")

    c = db[coll]

    props = []
    with open(infilepath) as infile:
        for l in infile:
            props.append(l.strip())

    counts = {}

    for p in props:
        counts[p] = {}

    for p in props:

        print(f"starting {p}")

        for t in types:

            # print(f"checking {t}")

            counts[p][t] = c.count_documents({
                f"properties.{p}": {
                    "$type": t
                }
            })

        counts[p]['has'] = c.count_documents({
            f"properties.{p}": {
                "$exists": True
            }
        })

    with open(outfilepath, 'w') as outfile:

        writer = csv.writer(outfile)
        writer.writerow(['property'] + types + ['exists'])

        for p in counts:
            row = [p]

            for c in counts[p]:
                row.append(counts[p][c])

            writer.writerow(row)

propcnt(
    "ways",
    "output/wayprops.txt",
    "output/waypropcnt.csv"
)

propcnt(
    "intersections",
    "output/intprops.txt",
    "output/intpropcnt.csv"
)
