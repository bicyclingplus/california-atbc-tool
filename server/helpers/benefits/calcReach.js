import { MongoClient } from 'mongodb';

import calcProjectLength from './calcProjectLength.js';

const calcReach = async (
  selectedWayIds,
  selectedIntersectionIds,
  userWays,
  userIntersections,
) => {

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

    const totalLength = calcProjectLength(selectedWays, userWays);

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

    return {
      selectedWays,
      selectedIntersections,
      totalLength,
      totalIntersections,
      hasOnlyUserMapSelections,
    };
  }
  finally {
    await client.close();
  }
};

export default calcReach;
