Dillon is working on an updated network for the tool based on a new model.

The new network will provide multiple values for bike/ped demand by year 2019 to 2023.

The new network is also based on an updated strava network, so all the ids will be backwards incompatible.

Initially, there are only two areas that have been modeled for the new network, each with some associated projects. Dillon would like these projects run through the tool with the project's year set to each available year for comparision. Output will be existing and projected travel for bike and ped modes for each project for each year.

Required inputs:

ways geojson file
intesections geojson file
start/end nodes file
project inputs (projects/segments/interections/infrastructure schema that I specified)

Pass 1 (2024-12-06):

NETWORK VALIDATION

ways geojson is not in the correct CRS (EPSG:3310 instead of EPSG:4326)
ways property bike_demand dictionary values are strings instead of numbers
ways property population values are strings instead of numbers
intersections property jobs values are strings instead of numbers
intersections property population values are strings instead of numbers
intersections property ped_demand values are strings instead of numbers

start/end nodes file not provided yet, so I cannot add source/target properties to ways

PROJECT VALIDATION

Project 2e17d626-3e34-4372-8fba-fd1974c369e1 has segment with an invalid edge_uid 52933049
All project node_ids do not exist in the network
40% of infrastructure element names are invalid
80% of infrastructure elements will have no effect due to element size columns all being zero

Pass 2 (2024-12-09):

NETWORK VALIDATION

Received the start/end nodes file and updated ways/intersections files. CRS fixed, numeric values fixed. I was able to add source/target properties.

NOTE: row # 102399 of start/end nodes file contains scientific notation 3.53E+08, and must be manually changed to 353000000 (was probably opened in excel or something with the column's type incorrectly set and then saved. as this is column contains ids, scientific notation is not appropriate)

PROJECT VALIDATION

Project 2e17d626-3e34-4372-8fba-fd1974c369e1 has segment with an invalid edge_uid 52933049
All project node_ids are now valid
Manually mapped bad infrastructure element names to valid ones for all except "repaving", now only 3% of names are invalid
Still ~80% will have never have an effect due to zero length/count in new/upgrade/retrofit columns
~40% of projects will have no difference in projected numbers because they do not include an element that has an effect for that benefit calculation

PIPELINE:

NETWORK:

1. nodes.py (add source/target properties to ways)
2. insert.py (insert network into mongo)

PROJECTS:

1. create projects/segments/interections/infrastructure CSV files
2. infrastructure.py (fix bad infrastructure element names)
3. sanity.py (checks to confirm validity of projects)
