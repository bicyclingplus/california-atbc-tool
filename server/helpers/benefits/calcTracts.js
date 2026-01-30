import * as turf from "@turf/turf";
import {
  MongoClient
} from 'mongodb';

const calc = async (
  userSegments,
  userIntersections,
  reach,
) => {
  const {
    selectedWays,
    selectedIntersections,
  } = reach;

  // create combined feature collection
  // with the four types of features
  const features = {
    type: "FeatureCollection",
    features: [
      ...selectedWays,
      ...selectedIntersections,
      ...userSegments,
      ...userIntersections,
    ],
  };

  // figure out which tracts intersect with the bike buffer
  let bike_buffer = turf.buffer(features, 1.00, {units: 'miles'});
  bike_buffer = turf.union(bike_buffer);

  const client = new MongoClient(process.env.MONGO_URI);

  const bike_tracts = await client
    .db('bctool')
    .collection('tracts')
    .find({
      geometry: {
        "$geoIntersects": {
          "$geometry": bike_buffer.geometry,
        }
      },
    })
    .toArray();

  // since the walk buffer is smaller, don't query the database
  // again, just calculate which tracts also intersect the
  // smaller buffer
  let walk_buffer = turf.buffer(features, 0.25, {units: 'miles'});
  walk_buffer = turf.union(walk_buffer);

  const walk_tracts = [];

  for(const tract of bike_tracts) {
    if(turf.intersect(turf.featureCollection([tract, walk_buffer])) !== null) {
      walk_tracts.push(tract);
    }
  }

  return {
    bike: bike_tracts,
    walk: walk_tracts,
  }
}

export default calc;
