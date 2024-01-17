import {
    COLUMNS,
    MODES,
    LOCATION_TYPES,
    ESTIMATES,
    SCALING_FACTORS,
} from '../constants.js';

import z from '../../collector.js';
import calcLength from './calcLength.js';
import calcShare from '../calcShare.js';
import getElement from '../getElement.js';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const travel_volume = require('../../../data/travel_volume.json');
const infrastructure = require('../../../data/infrastructure.json');

const calcPVcmjk = (
    EVcmj,
    selectedInfrastructure,
    project_length,
    num_intersections) => {

    // init object for projected volume
    // each value starts as existing volume
    const PVcmjk = {};

    for(let c of COLUMNS) {
        PVcmjk[c] = {};

        for(let m of MODES) {
            PVcmjk[c][m] = {};

            for(let j of LOCATION_TYPES) {

                PVcmjk[c][m][j] = {}

                for(let k of ESTIMATES) {
                    PVcmjk[c][m][j][k] = EVcmj[c][m][j];
                }
            }
        }
    }

    const length_to_use = calcLength(selectedInfrastructure, project_length);

    // for selected elements go through travel volume benefits and apply
    for(let i in selectedInfrastructure) {

        // skip, no benefits for this element
        if(!(i in travel_volume)) {
            continue;
        }

        for(let m of MODES) {

            // skip, no benefits for this mode
            if(!(m in travel_volume[i])) {
                continue;
            }

            const benefit = travel_volume[i][m];

            for(let T in SCALING_FACTORS) {

                const value = selectedInfrastructure[i][T];

                // skip, no value for this improvement type
                if(value === 0) {
                    continue;
                }

                const element = getElement(i);
                const { share } = calcShare(
                    element, value, length_to_use, num_intersections);

                for(let c of COLUMNS) {
                    for(let j of LOCATION_TYPES) {
                        for(let k of ESTIMATES) {

                            // this is from the NCmoj equation
                            // Vmj + Vmj * Ei * (Ni / L) * I

                            const adjustment = (
                                EVcmj[c][m][j] *
                                (benefit[k] / 100) *
                                share *
                                SCALING_FACTORS[T]
                            );

                            PVcmjk[c][m][j][k] += adjustment;

                            // debug
                            const {
                                calc_units,
                                units,
                            } = element;

                            z.put('safety', 'vmj_adjustments', [
                                i,
                                calc_units,
                                units,

                                T,
                                value,

                                c,
                                m,
                                j,
                                k,

                                EVcmj[c][m][j],
                                benefit[k] / 100,
                                share,
                                SCALING_FACTORS[T],
                                adjustment,
                            ]);
                        }
                    }
                }
            }
        }
    }

    // combined mode is walking plus bicycling
    for(let c of COLUMNS) {
        for(let j of LOCATION_TYPES) {
            for(let k of ESTIMATES) {
                PVcmjk[c].combined[j][k] = (
                    PVcmjk[c].walking[j][k] +
                    PVcmjk[c].bicycling[j][k]
                );
            }
        }
    }

    // debug
    for(let c of COLUMNS) {
        for(let m of MODES) {
            for(let j of LOCATION_TYPES) {
                for(let k of ESTIMATES) {
                    z.put('safety', 'vmj_projected', [
                        c,
                        m,
                        j,
                        k,
                        PVcmjk[c][m][j][k],
                    ]);
                }
            }
        }
    }

    return PVcmjk;
}

export default calcPVcmjk;
