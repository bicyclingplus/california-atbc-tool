import { createRequire } from "module";
import {
  GWPS,
  VEHICLE_TYPES,
  EMISSION_TYPES,
  ESTIMATES
} from './constants.js';

const require = createRequire(import.meta.url);
const fleet_makeup = require('../../data/fleet_makeup.json');
const emission_rates = require('../../data/emission_rates.json');

const _calc = (county, year, vmtReductions) => {

  // Check if we have the necessary data in the lookup tables
  if(! (county in fleet_makeup)) {
    console.log(`Missing fleet makeup for: ${county}`);
    return null;
  }

  if(! (county in emission_rates)) {
    console.log(`Missing emission rates for: ${county}`);
    return null;
  }

  if(! (year in emission_rates[county])) {
    console.log(`Missing emission rates for start year ${year} for county ${county}`);
    return null;
  }

  const benefits = {};

  // calculate the share of vmt reductions per vehicle type
  // taking into account the fraction of that vehicle
  // type of the total vehicles in the county
  const vehVMTReductions = {};

  for(let vehType of VEHICLE_TYPES) {

    vehVMTReductions[vehType] = {};

    for(let k of ESTIMATES) {
      vehVMTReductions[vehType][k] = (
        (fleet_makeup[county][vehType] / fleet_makeup[county].Total) *
        vmtReductions[k]);
    }
  }

  // calculate the reductions for each emission type
  // by totaling the reductions for each vehicle type
  // taking into account the share of vmt reductions
  // per vehicle type calculated above and the
  // emission rate for that emission type and vehicle
  // type for the project county and project year
  benefits.reductions = {};

  for(let emissionType of EMISSION_TYPES) {

    benefits.reductions[emissionType] = {};

    for(let k of ESTIMATES) {
      benefits.reductions[emissionType][k] = 0;
    }

    for(let vehType of VEHICLE_TYPES) {

      for(let k of ESTIMATES) {
        benefits.reductions[emissionType][k] += (
          vehVMTReductions[vehType][k] *
          emission_rates[county][year][vehType][emissionType]
        );
      }
    }
  }

  // calculate the CO2 equivalent for CO2, CH4, and N2O combined
  benefits.equivalent = {};

  for(let k of ESTIMATES) {
    benefits.equivalent[k] = 0;
  }

  for(let equivalent in GWPS) {

    for(let k of ESTIMATES) {
      benefits.equivalent[k] += (
        benefits.reductions[equivalent][k] * GWPS[equivalent]
      );
    }
  }

  return benefits;
};

const calcEmissions = (county, year, vmtReductions) => {

  return {
    miles: _calc(county, year, vmtReductions.miles),
    capita: _calc(county, year, vmtReductions.capita),
    jobs: _calc(county, year, vmtReductions.jobs),
    raw: _calc(county, year, vmtReductions.raw),
  };
};

export default calcEmissions;
