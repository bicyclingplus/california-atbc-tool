import { createRequire } from "module";

const require = createRequire(import.meta.url);
const infrastructure = require('../../data/infrastructure.json');
const nonInfrastructure = require('../../data/non_infrastructure.json');
const counties = require('../../data/counties.json');

const infrastructureNames = [];

for(let category of infrastructure.categories) {
  for(let item of category.items) {
    infrastructureNames.push(item.shortname);
  }
}

const nonInfrastructureNames = nonInfrastructure.items.map(el => el.shortname);

const countyNames = counties.counties.map(el => el.name);

const validCounty = (county) => {
  return countyNames.includes(county);
};

const validInfrastructure = (selectedInfrastructure) => {
  for(let element in selectedInfrastructure) {
    if(!infrastructureNames.includes(element)) {
      return false;
    }
  }

  return true;
}

const validNonInfrastructure = (selectedNonInfrastructure) => {
  for(let element of selectedNonInfrastructure) {
    if(!nonInfrastructureNames.includes(element)) {
      return false;
    }
  }

  return true;
}

export {
  validCounty,
  validInfrastructure,
  validNonInfrastructure,
};
