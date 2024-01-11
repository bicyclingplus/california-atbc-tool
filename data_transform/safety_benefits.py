import csv
import os
import json

infilename = "Safety_Benefits.csv"
outfilename = "quantitative.json"

benefits = {}

element_lookup = {
	"Bike boulevard": "bike-boulevard",
	"Conventional Bike Lane": "conventional-bike-lane",
	"Crossing islands": "crossing-island",
	"Curb Extensions": "curb-extension",
	"Edge Lane Roads": "edge-lanes",
	"Flashing beacons": "flashing-beacon",
	"Horizontal deflectors": "horizontal-deflector",
	"Lane Narrowing": "lane-narrowing",
	"Lighting": "lighting",
	"Protected Bike Lane": "protected-bike-lane",
	"Raised crossings": "raised-crossing",
	"Road diets": "road-diet",
	"Roundabouts": "roundabout",
	"Shared Streets": "shared-open-street",
	"Vertical Deflectors": "vertical-deflector",
}

element_lookup_lower = {}

for l in element_lookup:
	element_lookup_lower[l.lower()] = element_lookup[l]

class_lookup = {
	"Block Face": "block-face",
	"Intersection": "intersection",
}

mode_lookup = {
	"All": "all",
	"Vehicle": "vehicle",
	"Ped": "pedestrian",
	"Bike": "bike",
}

parameter_lookup = {
	"Crashes": "crashes",
	"Injuries": "injuries",
	"Deaths": "deaths",
	"Yield Compliance": "yielding",
	"Speed": "speed",
	"Crime": "crime",
}

with open(os.path.join('input', infilename)) as infile:

	reader = csv.reader(infile)

	headers = next(reader)

	for r in reader:

		element_name = r[0]

		# skip empty rows
		if element_name == "":
			continue

		element_name = element_name.strip().lower()

		# check element in lookup (new one added / spelling changed)
		if element_name not in element_lookup_lower:

			print('Missing {} in element lookup'.format(element_name))
			exit()

		element_name = element_lookup_lower[element_name]

		mode = r[2]

		if mode not in mode_lookup:
			print('Unknown mode {}'.format(mode))
			exit()

		element_class = r[3]

		if element_class not in class_lookup:
			print('Missing {} in class lookup'.format(element_class))
			exit()

		parameter = r[5]

		if parameter not in parameter_lookup:

			print('Unknown parameter {}'.format(parameter))
			exit()

		units = r[6]

		if units not in ["Factor", "percent", "mph"]:

			print('Unknown unit {}'.format(units))
			exit()

		direction = r[7]

		if direction not in ["Increase", "Decrease"]:

			print('Unknown direction {}'.format(direction))
			exit()

		effects = {
			"lower": float(r[8]) if r[8] != '' else None,
			"mean": float(r[9]) if r[9] != '' else None,
			"upper": float(r[10]) if r[10] != '' else None,
		}

		# skip zero effects
		if effects['mean'] == 0:
			continue

		# Change factor to percent
		if units == "Factor":

			for e in effects:
				temp = 1 / effects[e]
				temp = 1 - temp
				temp = temp * 100

				effects[e] = temp

			units = "percent"

		if direction == "Decrease":

			for e in effects:
				effects[e] *= -1

		if element_name not in benefits:
			benefits[element_name] = []

		benefits[element_name].append({
			"class": class_lookup[element_class],
			"mode": mode_lookup[mode],
			"parameter": parameter_lookup[parameter],
			"units": units,
			"lower": effects['lower'],
			"mean": effects['mean'],
			"upper": effects['upper'],
		})

json.dump(benefits, open(os.path.join("output", outfilename), "w"))
