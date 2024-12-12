walk_distribution = {
    "0.1": 0.1,
    "0.2": 0.17,
    "0.3": 0.16,
    "0.4": 0.12,
    "0.5": 0.09,
    "0.6": 0.07,
    "0.7": 0.06,
    "0.8": 0.04,
    "0.9": 0.03,
    "1.0": 0.03,
    "1.2": 0.02,
    "1.1": 0.02,
    "1.3": 0.01,
    "1.4": 0.01,
    "1.5": 0.01,
    "1.6": 0.01,
    "1.7": 0.01,
    "1.8": 0.04,
}

segments = [
    {
        "Bicycle demand": 50,
        "Length": 0.1 * 5280,
    },
    {
        "Bicycle demand": 75,
        "Length": 0.2 * 5280,
    },
    {
        "Bicycle demand": 25,
        "Length": 0.05 * 5280,
    },
]

intersections = [
    {
        "Pedestrian demand": 200,
        "adjacent selected ways lengths": [
            0.1 * 5280,
            0.2 * 5280,
        ],
    },
    {
        "Pedestrian demand": 400,
        "adjacent selected ways lengths": [
            0.1 * 5280,
            0.05 * 5280,
        ],
    },
]

walk_average = 0

for dist in walk_distribution:
    walk_average += walk_distribution[dist]*float(dist)

# print('walk_average', walk_average)

for i in intersections:
    i["adj_sel_way_len"] = sum(i["adjacent selected ways lengths"]) / len(i["adjacent selected ways lengths"])

test = 0

for i in intersections:
    for adj in i["adjacent selected ways lengths"]:
        test += adj

# print(intersections)

def weighted_miles_pedestrian(project_id):
    # intersections = intersections_n[segments_n["Project ID"]==project_id]
    # proj_length = reach[reach["Project ID"] == project_id][reach["Type"]=="network"]["Total length of segments"]
    # proj_length = sum([s['Length'] for s in segments])
    # proj_length = None
    proj_length = 0.35*5280
    walk_average_in_proj = 0
    # total_miles = (intersections["Pedestrian demand"] * (adjacent_selected_ways_average_length/5280)).sum()
    total_miles = sum([i['Pedestrian demand'] * i['adj_sel_way_len'] / 5280
        for i in intersections])

    # print('proj_length', proj_length)
    # print('total_miles', total_miles)

    for dist in walk_distribution:
        in_project = float(dist)*0.30
        if (in_project > float(proj_length)/5280):
            walk_average_in_proj += walk_distribution[dist]*float(proj_length)/5280
        else:
            walk_average_in_proj += walk_distribution[dist]*in_project
    # print("unique people:",total_miles/walk_average_in_proj)
    # print('walk_average_in_proj', walk_average_in_proj)
    weighted_miles = walk_average * total_miles/walk_average_in_proj
    return(weighted_miles)


if __name__ == "__main__":
    print(weighted_miles_pedestrian("test"))
