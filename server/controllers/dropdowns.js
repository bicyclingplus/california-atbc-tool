import { createRequire } from "module";

const require = createRequire(import.meta.url);
const infrastructure = require('../data/infrastructure.json');
const nonInfrastructure = require('../data/non_infrastructure.json');
const counties = require('../data/counties.json');

const getDropdowns = (req, res) => {
  return res.json({
    infrastructure,
    nonInfrastructure,
    counties,
  });
};

export {
  getDropdowns,
};
