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

  // the buffer will be a a polygon for each feature,
  // merge into a single polygon
  bike_buffer = turf.union(bike_buffer);

  // query on the simpler geometry of the bounding box
  const bike_bbox = turf.bbox(bike_buffer);
  const bike_bbox_poly = turf.bboxPolygon(bike_bbox);

  const client = new MongoClient(process.env.MONGO_URI);

  const all_tracts = await client
    .db('bctool')
    .collection('tracts')
    .find({
      geometry: {
        "$geoIntersects": {
          "$geometry": bike_bbox_poly.geometry,
        }
      },
    })
    .toArray();

  // figure out which tracts are within the bike buffer
  const bike_tracts = [];

  for(const tract of all_tracts) {
    if(turf.intersect(turf.featureCollection([tract, bike_buffer])) !== null) {
      bike_tracts.push(tract);
    }
  }

  // since the walk buffer is smaller, just calculate which
  // bike tracts also intersect the walk buffer
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
