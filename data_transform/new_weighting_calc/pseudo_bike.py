bicycle_distribution = {
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

segments = [
    {
        "Bicycle demand": 50,
        "Length": 0.1*5280,
    },
    {
        "Bicycle demand": 75,
        "Length": 0.2*5280,
    },
    {
        "Bicycle demand": 25,
        "Length": 0.05*5280,
    },
]

bicycle_average = 0

for dist in bicycle_distribution:
    bicycle_average += bicycle_distribution[dist]*float(dist)

# print('bicycle_average', bicycle_average)

def weighted_miles_bike(project_id):
    # segments = segments_n[segments_n["Project ID"]==project_id]
    # proj_length = reach[reach["Project ID"] == project_id][reach["Type"]=="network"]["Total length of segments"]
    proj_length = sum([s['Length'] for s in segments])
    bicycle_average_in_proj = 0
    # total_miles = (segments["Bicycle demand"] * segments["Length"]/5280).sum()
    total_miles = sum([s['Bicycle demand'] * s['Length'] / 5280
        for s in segments])

    # print('proj_length', proj_length)
    # print('total_miles', total_miles)


    # print('loop:')

    for dist in bicycle_distribution:
        in_project = float(dist)*0.25
        if (in_project > float(proj_length)/5280):
            bicycle_average_in_proj += bicycle_distribution[dist]*float(proj_length)/5280
        else:
            bicycle_average_in_proj += bicycle_distribution[dist]*in_project

        # print('dist', dist)
        # print('bicycle_distribution[dist]', bicycle_distribution[dist])
        # print('in_project', in_project)
        # print('dist_total_project', bicycle_distribution[dist]*float(proj_length)/5280)
        # print('dist_in_project', bicycle_distribution[dist]*in_project)
        # print('used', 'dist_total_project' if in_project > float(proj_length)/5280 else 'dist_in_project')
        # print('---------------------------')

    # print('bicycle_average_in_proj', bicycle_average_in_proj)
    weighted_miles = bicycle_average * total_miles/bicycle_average_in_proj
    return(weighted_miles)

if __name__ == "__main__":
    print(weighted_miles_bike("test"))
