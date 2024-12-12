# take in project segments
# return some length in MILES
def total_miles_bike(segments):
    return sum([
        s['properties']['Bicycle demand'] *
        s['properties']['Length'] /
        5280
        for s in segments])

# take in an intersection
# return selected, adjacent segments to that intersection
def adj_selected_segments(intersection):
    return adj_selected_segments_FAKE(intersection)

def adj_selected_segments_REAL(intersection):

    # spatial query
    adj_segments = query_adj_segments(intersection)

    # only return the segments selected in the project
    return filter(lambda x: x in project_segments, adj_segments)

def adj_selected_segments_FAKE(intersection):
    return [
        { "properties": { "Length": x }}
        for x in intersection["properties"]["adjacent selected ways lengths"]]

# take in an intersection
# return average length in FEET of selected segments adjacent to that intersection
def adj_selected_segments_avg_length(intersection):

    segments = adj_selected_segments(intersection)

    return sum([s['properties']['Length'] for s in segments]) / len(segments)

# take in project intersections
# return some length in MILES
def total_miles_ped(intersections):

    return sum([
        i['properties']['Pedestrian demand'] *
        adj_selected_segments_avg_length(i) /
        5280
        for i in intersections])

# take in project segments
# return total project length in MILES
def calc_proj_length(segments):

    return sum([s['properties']['Length'] / 5280 for s in segments])

ped_distribution = {
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

bike_distribution = {
    "0.25": 0.198,
    "0.75": 0.271,
    "1.25": 0.174,
    "1.75": 0.094,
    "2.25": 0.063,
    "2.75": 0.034,
    "3.25": 0.039,
    "3.75": 0.028,
    "4.25": 0.014,
    "4.75": 0.010,
    "5.25": 0.013,
    "5.75": 0.010,
    "6.25": 0.007,
    "12.5": 0.045,
}

PED_WEIGHT_CONSTANT = 0.3
BIKE_WEIGHT_CONSTANT  = 0.25

# take in total project length in miles and project intersections
# return weighted miles
def weight_ped(proj_length, intersections):
    return weight(
        ped_distribution,
        PED_WEIGHT_CONSTANT,
        proj_length,
        total_miles_ped(intersections))

# take in total project length in miles and project segments
# return weighted miles
def weight_bike(proj_length, segments):
    return weight(
        bike_distribution,
        BIKE_WEIGHT_CONSTANT,
        proj_length,
        total_miles_bike(segments))

# take in:
# mode_distribution = bike/ped table
# mode_constant = 0.25 for bike, 0.30 for ped
# project_length = total length of project segments, in miles
# total_miles = bike/ped total miles
# return weighted miles
def weight(mode_distribution, mode_constant, project_length, total_miles):

    # print('project_length', project_length)
    # print('total_miles', total_miles)

    mode_average = 0
    average_in_proj = 0

    for dist in mode_distribution:
        mode_average += mode_distribution[dist] * float(dist)
        in_project = float(dist) * mode_constant
        average_in_proj += mode_distribution[dist] * min(in_project, project_length)

    # print('mode_average', mode_average)
    # print('average_in_proj', average_in_proj)

    return mode_average * total_miles / average_in_proj

# 5
# 15
# 1.25
# = 21.25

segments = [
    {
        "properties": {
            "Bicycle demand": 50,
            "Length": 528,
        },
    },
    {
        "properties": {
            "Bicycle demand": 75,
            "Length": 1056,
        },
    },
    {
        "properties": {
            "Bicycle demand": 25,
            "Length": 264,
        },
    },
]

intersections = [
    {
        "properties": {
            "Pedestrian demand": 200,
            "adjacent selected ways lengths": [
                0.1 * 5280,
                0.2 * 5280,
            ],
        },
    },
    {
        "properties": {
            "Pedestrian demand": 400,
            "adjacent selected ways lengths": [
                0.1 * 5280,
                0.05 * 5280,
            ],
        },
    },
]

if __name__ == "__main__":
    proj_length = calc_proj_length(segments)
    print("bike weighted: ", weight_bike(proj_length, segments))
    print("ped weighted: ", weight_ped(proj_length, intersections))
