import { MongoClient } from 'mongodb';
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
    selectedWayIds,
    selectedIntersectionIds,
    userWays,
    userIntersections,
  } = req.body;

  const client = new MongoClient(process.env.MONGO_URI);

  try {
    const db = client.db('bctool');

    const waysQuery = {
      'properties.edge_uid': {
        '$in': selectedWayIds,
      },
    };

    const selectedWays = await db
      .collection('ways')
      .find(waysQuery)
      .toArray();

    const intersectionsQuery = {
      'properties.node_id': {
        '$in': selectedIntersectionIds,
      },
    };

    const selectedIntersections = await db
      .collection('intersections')
      .find(intersectionsQuery)
      .toArray();

    const projectLength = calcProjectLength(selectedWays, userWays);
    const totalIntersections = (
      selectedIntersections.length +
      userIntersections.length
    );

    const hasOnlyUserMapSelections = Boolean(
      !selectedWays.length &&
      !selectedIntersections.length &&
      (userWays.length ||
      userIntersections.length)
    );

    const existingTravel = await calcDemand(
      selectedWays,
      userWays,
      selectedIntersections,
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
      selectedWays,
      selectedIntersections,
      safety,
    );

    return res.json({
      benefits: benefits,
    });

  }
  finally {
    await client.close();
  }
};

export {
  postBenefits,
};
