import {
    COLUMNS,
    MODES,
    LOCATION_TYPES,
    ESTIMATES,
    SCALING_FACTORS,
} from '../constants.js';

import c from '../../collector.js';
import calcLength from './calcLength.js';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const travel_volume = require('../../data/travel_volume.json');
const infrastructure = require('../../data/infrastructure.json');

const calcVmj_projected = (
    Vmj_existing,
    selectedInfrastructure,
    project_length,
    num_intersections) => {

    const Vmj_projected = {};

    for(let column of COLUMNS) {
        Vmj_projected[column] = {};

        for(let mode of MODES) {
            Vmj_projected[column][mode] = {};

            for(let location_type of LOCATION_TYPES) {

                Vmj_projected[column][mode][location_type] = {}

                for(let estimate of ESTIMATES) {

                    Vmj_projected[column][mode][location_type][estimate] =
                    Vmj_existing[column][mode][location_type];
                }
            }
        }
    }

    const length_to_use = calcLength(selectedInfrastructure, project_length);

    // for selected elements go through travel volume benefits and apply
    for(let category of infrastructure.categories) {

        for(let item of category.items) {

            // the element is selected
            // the element has benefits
            // the element has benefits for this mode
            if(item.shortname in selectedInfrastructure &&
                item.shortname in travel_volume) {

                for(let mode of MODES) {

                    if(mode in travel_volume[item.shortname]) {

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
                                    share = (value * 100) / length_to_use;
                                }
                                else if(item.units === 'length') {
                                    share = value / length_to_use;
                                }
                            }
                            else if(item.calc_units === 'count') {
                                share = value / num_intersections;
                            }

                            for(let column of COLUMNS) {

                                for(let location_type of LOCATION_TYPES) {

                                    for(let estimate of ESTIMATES) {

                                        // this is from the NCmoj equation
                                        // Vmj + Vmj * Ei * (Ni / L) * I

                                        let adjustment = (
                                            Vmj_existing[column][mode][location_type] *
                                            (benefit[estimate] / 100) *
                                            share *
                                            SCALING_FACTORS[type]
                                        );

                                        Vmj_projected[column][mode][location_type][estimate] += adjustment;

                                        // debug
                                        c.put('safety', 'vmj_adjustments', [
                                            item.shortname,
                                            item.calc_units,
                                            item.units,

                                            type,
                                            value,

                                            column,
                                            mode,
                                            location_type,
                                            estimate,

                                            Vmj_existing[column][mode][location_type],
                                            benefit[estimate] / 100,
                                            share,
                                            SCALING_FACTORS[type],
                                            adjustment,
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // calc combined for Vmj_projected
    for(let column of COLUMNS) {
        for(let location_type of LOCATION_TYPES) {
            for(let estimate of ESTIMATES) {
                Vmj_projected[column].combined[location_type][estimate] = (
                    Vmj_projected[column].walking[location_type][estimate] +
                    Vmj_projected[column].bicycling[location_type][estimate]
                );
            }
        }
    }

    // debug
    for(let column of COLUMNS) {
        for(let mode of MODES) {
            for(let location_type of LOCATION_TYPES) {
                for(let estimate of ESTIMATES) {
                    c.put('safety', 'vmj_projected', [
                        column,
                        mode,
                        location_type,
                        estimate,
                        Vmj_projected[column][mode][location_type][estimate],
                    ]);
                }
            }
        }
    }

    return Vmj_projected;
}

export default calcVmj_projected;
