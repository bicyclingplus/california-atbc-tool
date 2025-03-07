import { MongoClient } from 'mongodb';
import Ajv from 'ajv';

import schemas from '../schemas/schemas.js';
import calcProjectLength from '../helpers/benefits/calcProjectLength.js';
import calcDemand from '../helpers/benefits/calcDemand.js';

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

  const client = new MongoClient(process.env.MONGO_URI);

  try {
    const db = client.db('bctool');
    const query = {
      'properties.edge_uid': {
        '$in': selectedWayIds,
      },
    };

    const selectedWays = await db
      .collection('ways')
      .find(query)
      .toArray();

    const totalLength = calcProjectLength(selectedWays, userWays);
    const totalIntersections = (
      selectedIntersectionIds.length +
      userIntersections.length
    );

    return res.json({
      totalLength,
      totalIntersections,
    });
  }
  finally {
    await client.close();
  }
};

export {
  postReach,
};
