import {
    SCALING_FACTORS,
    ESTIMATES,
    INDUCED_TRAVEL,
    ROUTE_SHIFT,
    CAR_SHIFT,
    OTHER_SHIFT,
} from './constants.js';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const travel_volume = require('../data/travel_volume.json');

const _calcPartial = (total, percent) => {

    let increase = {};

    for(let estimate of ESTIMATES) {
        increase[estimate] = (
            total[estimate] *
            (percent / 100)
        );
    }

    return increase;
};

const _calcTravelMode = (mode, infrastructure, selectedInfrastructure,
    existingTravel, project_length, num_intersections) => {

    let travel = {};

    // the travel model was supposed to provide
    // lower, mean, and upper estimates, but it
    // doesn't yet, so take the mean value as
    // the starting point for all three for now
    travel.existing = {};

    for(let estimate of ESTIMATES) {
        travel.existing[estimate] = existingTravel.mean;
    }

    // build a list of all increases for the selected
    // elements in the project
    let increases = [];

    // go through each category and its elements
    for(let category of infrastructure.categories) {

        for(let item of category.items) {

            // the element is selected
            // the element has benefits
            // the element has benefits for this mode
            if(item.shortname in selectedInfrastructure &&
                item.shortname in travel_volume &&
                mode in travel_volume[item.shortname]) {

                let benefit = travel_volume[item.shortname][mode];

                // calculate the increase for each improvement
                // type for this element
                for(let type in SCALING_FACTORS) {

                    let value = selectedInfrastructure[item.shortname][type];

                    if(value === 0) {
                        continue;
                    }

                    let share = 0;

                    // calculate the project share for this element
                    if(item.calc_units === 'length') {

                        if(item.units === 'count') {
                            // In this case we ask them for a count and
                            // then apply a preset length per item
                            // i.e. lights every 100 feet
                            // and then apply that as a portion of the
                            // total project length
                            // all are assumed to be per 100 feet right now
                            // this will probably change at some point.
                            share = (value * 100) / project_length;
                        }
                        else if(item.units === 'length') {
                            share = value / project_length;
                        }
                    }
                    else if(item.calc_units === 'count') {
                        share = value / num_intersections;
                    }

                    // calculate the increase in travel for this benefit
                    // using the benefit percentage, the existing travel,
                    // the project share, and the type of improvement
                    let increase = {};

                    for(let estimate of ESTIMATES) {
                        increase[estimate] = (
                            (benefit[estimate] / 100) *
                            travel.existing[estimate] *
                            share *
                            SCALING_FACTORS[type]
                        );
                    }

                    increases.push(increase);
                }
            }
        }
    }

    // total up the increases in travel
    travel.total = {};

    for(let estimate of ESTIMATES) {
        travel.total[estimate] = 0;
    }

    for(let increase of increases) {
        for(let estimate of ESTIMATES) {
            travel.total[estimate] += increase[estimate];
        }
    }

    // calculate specific increases as a fraction
    // of the total travel increase
    travel.inducedTravel = _calcPartial(travel.total, INDUCED_TRAVEL[mode]);
    travel.routeShift = _calcPartial(travel.total, ROUTE_SHIFT[mode]);
    travel.carShift = _calcPartial(travel.total, CAR_SHIFT[mode]);
    travel.otherShift = _calcPartial(travel.total, OTHER_SHIFT[mode]);

    // calculate the total projected travel for the project
    // with the selected benefits as the sum of the
    // estimated existing travel in the project and the
    // total increase in travel for the benefits
    travel.projected = {};

    for(let estimate of ESTIMATES) {
        travel.projected[estimate] = (
            travel.existing[estimate] +
            travel.total[estimate]
        );
    }

    return travel;
};

const _calc = (infrastructure, selectedInfrastructure, existingTravel,
    project_length, num_intersections) => {

    let travel = {};

    travel.bike = _calcTravelMode(
        'bicycling',
        infrastructure,
        selectedInfrastructure,
        existingTravel.bike,
        project_length,
        num_intersections);

    travel.pedestrian = _calcTravelMode(
        'walking',
        infrastructure,
        selectedInfrastructure,
        existingTravel.pedestrian,
        project_length,
        num_intersections);

    // combine the projected bike and ped travel
    // for the total projected travel in the project
    // this is not displayed, but it's used in the
    // safety benefits calculations
    travel.totalProjected = {};

    for(let estimate of ESTIMATES) {
        travel.totalProjected[estimate] = (
            travel.bike.projected[estimate] +
            travel.pedestrian.projected[estimate]
        );
    }

    return travel;
};

const calcTravel = (infrastructure, selectedInfrastructure, travel,
    project_length, num_intersections) => {

    return {
        miles: _calc(infrastructure, selectedInfrastructure, travel.miles,
                        project_length, num_intersections),

        capita: _calc(infrastructure, selectedInfrastructure, travel.capita,
                        project_length, num_intersections),

        jobs: _calc(infrastructure, selectedInfrastructure, travel.jobs,
                        project_length, num_intersections),
    };
};

export default calcTravel;
