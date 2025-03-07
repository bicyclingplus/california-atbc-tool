import { MongoClient } from 'mongodb';

const invalidLng = (coord) => {
  return isNaN(coord) || coord > 180 || coord < -180;
}

const invalidLat = (coord) => {
  return isNaN(coord) || coord > 90 || coord < -90;
}

// this endpoint takes in the corners of a latlng bounding box
// the corners of the bounding box are then transformed into a geojson polygon
// and used to query for ways/intersections that intersect the polygon
// we need all four url paramters and the two latlngs must be different
//
// y1, x1 is the latlng for the south west corner of the bounding box
// y2, x2 is the latlng for north east corner of the bounding box
//
// y1 = South latitude
// x1 = West longitude
//
// y2 = North latitude
// x2 = East longitude
//
// The polygon is then defined with 5 points A, B, C, D, A
// A (x1, y1) South West corner
// B (x1, y2) North West corner
// C (x2, y2) North East corner
// D (y2, y1) South East corner
// A (x1, y1) Back to the SW corner to close the polygon
const getFeatures = async (req, res) => {
  if(!req.query.x1 || !req.query.x2 || !req.query.y1 || !req.query.y2) {
    return res.status(400).send({
      error: "All four bounding box coordinates (x1, y1, x2, and y2) are required."
    });
  }

  const x1 = parseFloat(req.query.x1);
  const x2 = parseFloat(req.query.x2);
  const y1 = parseFloat(req.query.y1);
  const y2 = parseFloat(req.query.y2);

  if(invalidLng(x1)) {
    return res.status(400).send({
     error: "Parameter x1 is invalid longitude",
    });
  }

  if(invalidLng(x2)) {
    return res.status(400).send({
      error: "Parameter x2 is invalid longitude",
    });
  }

  if(invalidLat(y1)) {
    return res.status(400).send({
      error: "Parameter y1 is invalid latitude",
    });
  }

  if(invalidLat(y1)) {
    return res.status(400).send({
      error: "Parameter y2 is invalid latitude",
    });
  }

  if(x1 === x2 && y1 === y2) {
    return res.status(400).send({
      error: "SW and NE Bounding box corners must be different.",
    });
  }

  const client = new MongoClient(process.env.MONGO_URI);

  try {

    const db = client.db('bctool');
    const waysQuery = {
      geometry: {
        "$geoIntersects": {
          "$geometry": {
            type: "Polygon",
            coordinates: [[
              [x1, y1],
              [x1, y2],
              [x2, y2],
              [x2, y1],
              [x1, y1],
            ]]
          },
        },
      }
    };

    const waysResults = await db
      .collection('ways')
      .find(waysQuery)
      .toArray();

    const node_ids = [
      ...new Set([
        ...waysResults.map(el => el.properties.source),
        ...waysResults.map(el => el.properties.target),
      ]),
    ];

    const intersectionsQuery = {
      'properties.node_id': {
        '$in': node_ids,
      }
    };

    const intersectionsResults = await db
      .collection('intersections')
      .find(intersectionsQuery)
      .toArray();

    return res.json({
      ways: {
        type: "FeatureCollection",
        features: waysResults,
      },
      intersections: {
        type: "FeatureCollection",
        features: intersectionsResults,
      }
    });
  }
  finally {
    await client.close();
  }
};

export {
  getFeatures,
};
