import Ajv from 'ajv';

import schemas from '../schemas/schemas.js';
import calcProjectLength from '../helpers/benefits/calcProjectLength.js';
import calcDemand from '../helpers/benefits/calcDemand.js';

const postReach = async (req, res) => {
  const ajv = new Ajv({
    schemas: schemas,
  });
  const validate = ajv.getSchema("schemas/reach.schema.json");
  const valid = validate(req.body);

  if(!valid) {
    return res.status(400).json({
      'error': 'Bad post data',
    });
  }

  const {
    selectedWays,
    selectedIntersections,
    userWays,
    userIntersections,
  } = req.body;

  const projectLength = calcProjectLength(selectedWays, userWays);

  const existingTravel = await calcDemand(
    selectedWays,
    userWays,
    selectedIntersections,
    userIntersections,
    projectLength,
  );

  return res.json({
    projectLength: projectLength,
    existingTravel: existingTravel,
  });
};

export {
  postReach,
};
