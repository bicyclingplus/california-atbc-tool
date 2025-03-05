import {
    SCALING_FACTORS,
    ESTIMATES,
    INDUCED_TRAVEL,
    ROUTE_SHIFT,
    CAR_SHIFT,
    OTHER_SHIFT,
} from './constants.js';

import calcShare from './calcShare.js';
import getElement from './getElement.js';
import c from '../collector.js';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const travel_volume = require('../../data/travel_volume.json');

const _calcPartial = (total, percent) => {

    const increase = {};

    for(let k of ESTIMATES) {
        increase[k] = (
            total[k] *
            (percent / 100)
        );
    }

    return increase;
};

const _calcTravelMode = (
    m,
    selectedInfrastructure,
    existingTravel,
    project_length,
    num_intersections) => {

    const travel = {};

    // the travel model was supposed to provide
    // lower, mean, and upper estimates, but it
    // doesn't yet, so take the mean value as
    // the starting point for all three for now
    travel.existing = {};

    for(let k of ESTIMATES) {
        travel.existing[k] = existingTravel.mean;
    }

    // build a list of all increases for the selected
    // elements in the project
    const increases = [];

    for(let i in selectedInfrastructure) {

        // does element have travel benefits
        if(!(i in travel_volume)) {
            continue;
        }

        // does element have travel benefits for this mode
        if(!(m in travel_volume[i])) {
            continue;
        }

        const benefit = travel_volume[i][m];
        const element = getElement(i);
        const { calc_units, units } = element;

        // calculate the increase for each improvement
        // type for this element
        for(let T in SCALING_FACTORS) {

            const value = selectedInfrastructure[i][T];

            // skip if not filled in
            if(value === 0) {
                continue;
            }

            const share = calcShare(
                element, value, project_length, num_intersections);

            // calculate the increase in travel for this benefit
            // using the benefit percentage, the existing travel,
            // the project share, and the type of improvement
            const increase = {};

            for(let k of ESTIMATES) {
                increase[k] = (
                    (benefit[k] / 100) *
                    travel.existing[k] *
                    share.share *
                    SCALING_FACTORS[T]
                );

                // debug
                // todo add mode?
                c.put('travel', 'adjustments', [
                    i,
                    calc_units,
                    units,
                    T,
                    value,
                    share.Ni,
                    share.L,
                    k,
                    travel.existing[k],
                    (benefit[k] / 100),
                    share.share,
                    SCALING_FACTORS[T],
                    increase[k],
                ]);
            }

            increases.push(increase);
        }
    }

    // total up the increases in travel
    travel.total = {};

    for(let k of ESTIMATES) {
        travel.total[k] = 0;
    }

    for(let increase of increases) {
        for(let k of ESTIMATES) {
            travel.total[k] += increase[k];
        }
    }

    // calculate specific increases as a fraction
    // of the total travel increase
    travel.inducedTravel = _calcPartial(travel.total, INDUCED_TRAVEL[m]);
    travel.routeShift = _calcPartial(travel.total, ROUTE_SHIFT[m]);
    travel.carShift = _calcPartial(travel.total, CAR_SHIFT[m]);
    travel.otherShift = _calcPartial(travel.total, OTHER_SHIFT[m]);

    // calculate the total projected travel for the project
    // with the selected benefits as the sum of the
    // estimated existing travel in the project and the
    // total increase in travel for the benefits
    travel.projected = {};

    for(let k of ESTIMATES) {
        travel.projected[k] = (
            travel.existing[k] +
            travel.total[k]
        );
    }

    // debug
    for(let k of ESTIMATES) {
        c.put('travel', 'projected', [
            k,
            travel.existing[k],
            travel.total[k],
            travel.inducedTravel[k],
            travel.routeShift[k],
            travel.carShift[k],
            travel.otherShift[k],
            travel.projected[k],
        ]);
    }

    return travel;
};

const _calc = (
    selectedInfrastructure,
    existingTravel,
    project_length,
    num_intersections) => {

    let travel = {};

    c.addPrepends('travel', 'projected', ['bicycling']);
    c.addPrepends('travel', 'adjustments', ['bicycling']);

    travel.bike = _calcTravelMode(
        'bicycling',
        selectedInfrastructure,
        existingTravel.bike,
        project_length,
        num_intersections);

    c.changePrepend('travel', 'projected', 1, 'walking');
    c.changePrepend('travel', 'adjustments', 1, 'walking');

    travel.pedestrian = _calcTravelMode(
        'walking',
        selectedInfrastructure,
        existingTravel.pedestrian,
        project_length,
        num_intersections);

    // combine the projected bike and ped travel
    // for the total projected travel in the project
    // this is not displayed, but it's used in the
    // safety benefits calculations
    travel.totalProjected = {};

    for(let k of ESTIMATES) {
        travel.totalProjected[k] = (
            travel.bike.projected[k] +
            travel.pedestrian.projected[k]
        );
    }

    return travel;
};

const calcTravel = (
    selectedInfrastructure,
    travel,
    project_length,
    num_intersections) => {

    c.setPrepends('travel', 'projected', ['travel']);
    c.setPrepends('travel', 'adjustments', ['travel']);

    const miles = _calc(selectedInfrastructure, travel.miles,
                        project_length, num_intersections);

    c.setPrepends('travel', 'projected', ['capita']);
    c.setPrepends('travel', 'adjustments', ['capita']);

    const capita = _calc(selectedInfrastructure, travel.capita,
                        project_length, num_intersections);

    c.setPrepends('travel', 'projected', ['jobs']);
    c.setPrepends('travel', 'adjustments', ['jobs']);

    const jobs = _calc(selectedInfrastructure, travel.jobs,
                        project_length, num_intersections);

    return {
        miles: miles,
        capita: capita,
        jobs: jobs,
    };
};

// export default calcTravel;

export {
    calcTravel as default,
    _calc,
}
