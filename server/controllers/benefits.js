import {
  MongoClient,
  ObjectId
} from 'mongodb';
import Ajv from 'ajv';

import schemas from '../schemas/schemas.js';
import calcProjectLength from '../helpers/benefits/calcProjectLength.js';
import calcDemand from '../helpers/benefits/calcDemand.js';
import calcBenefits from '../helpers/benefits/calcBenefits.js';

const postBenefits = async (req, res) => {
  const ajv = new Ajv({schemas});
  const validate = ajv.getSchema("schemas/benefits.schema.json");
  const valid = validate(req.body);

  if(!valid) {
    return res.status(400).json({
      'error': 'Bad post data',
    });
  }

  // TODO
  // analysis of int/way props and update schemas for
  // nullable (or other cases)
  //
  // checks for:
  // county in counties
  // selected infrastructure in infrastructure
  // selected noninfrastructure in noninfrastructure
  // year reasonable

  const {
    type,
    subtype,
    county,
    year,
    timeframe,
    transit,
    safety,
    selectedInfrastructure,
    selectedNonInfrastructure,
    selectedWays,
    selectedIntersections,
    userWays,
    userIntersections,
  } = req.body;

  const freshSegments = [];
  const freshIntersections = [];

  const client = new MongoClient(process.env.MONGO_URI);

  try {
    const db = client.db('bctool');
    const ways = db.collection('ways');
    const intersections = db.collection('intersections');

    for(const way of selectedWays) {
      const fresh = await ways.findOne({
        '_id': new ObjectId(way._id),
      });
      freshSegments.push(fresh);
    }

    for(const intersection of selectedIntersections) {
      const fresh = await intersections.findOne({
        '_id': new ObjectId(intersection._id),
      });
      freshIntersections.push(fresh);
    }
  }
  finally {
    await client.close();
  }

  const projectLength = calcProjectLength(freshSegments, userWays);
  const totalIntersections = freshIntersections.length + userIntersections.length;

  const hasOnlyUserMapSelections = Boolean(
    !freshIntersections.length &&
    !freshSegments.length &&
    (userWays.length ||
    userIntersections.length)
  );

  const existingTravel = await calcDemand(
    freshSegments,
    userWays,
    freshIntersections,
    userIntersections,
    projectLength,
  );

  const benefits = calcBenefits(
    type,
    subtype,
    county,
    year,
    timeframe,
    transit,
    projectLength,
    totalIntersections,
    existingTravel,
    selectedInfrastructure,
    selectedNonInfrastructure,
    hasOnlyUserMapSelections,
    freshSegments,
    freshIntersections,
    safety,
  );

  return res.json({
    benefits: benefits,
  });
};

export {
  postBenefits,
};
