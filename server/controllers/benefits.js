import Ajv from 'ajv';

import schemas from '../schemas/schemas.js';

import calcAll from '../helpers/benefits/calcAll.js';

const postBenefits = async (req, res) => {
  const ajv = new Ajv({schemas});
  const validate = ajv.getSchema("schemas/benefits.schema.json");
  const valid = validate(req.body);

  if(!valid) {
    return res.status(400).json({
      'error': 'Bad post data',
    });
  }

  const {
    // details
    county,
    year,
    timeframe,
    type,
    subtype,
    transit,
    safety,

    //elements
    selectedInfrastructure,
    selectedNonInfrastructure,

    // reach
    selectedWayIds,
    selectedIntersectionIds,
    userWays,
    userIntersections,
  } = req.body;

  const { benefits } = await calcAll(
    selectedWayIds,
    selectedIntersectionIds,
    userWays,
    userIntersections,
    type,
    subtype,
    county,
    year,
    timeframe,
    transit,
    selectedInfrastructure,
    selectedNonInfrastructure,
    safety,
  );

  return res.json({
    benefits,
  });
};

export {
  postBenefits,
};
