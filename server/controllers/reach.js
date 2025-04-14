import Ajv from 'ajv';

import schemas from '../schemas/schemas.js';
import calcReach from '../helpers/benefits/calcReach.js';

const postReach = async (req, res) => {
  const ajv = new Ajv({schemas});
  const validate = ajv.getSchema("schemas/reach.schema.json");
  const valid = validate(req.body);

  if(!valid) {
    return res.status(400).json({
      'error': 'Bad post data',
    });
  }

  const {
    selectedWayIds,
    selectedIntersectionIds,
    userWays,
    userIntersections,
  } = req.body;

  const {
    totalLength,
    totalIntersections,
  } = await calcReach(
    selectedWayIds,
    selectedIntersectionIds,
    userWays,
    userIntersections,
  );

  return res.json({
    totalLength,
    totalIntersections,
  });
};

export {
  postReach,
};
