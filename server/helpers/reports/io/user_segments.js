import { writeOrAppendCSV } from '../../writeCSV.js';
import * as turf from "@turf/turf";

const FEET_PER_KM = 3280.84;

export default (id, segments) => {

  const headers = [
    'id',
    'length (ft)',
    'oneway',
    'effective length (ft)',
  ];

  const data = [];

  for(let segment of segments) {

    const length_km = turf.length(segment);
    const effective_km = segment.properties.one_way_ca ? length_km : length_km * 2;

    data.push([
      id,
      length_km * FEET_PER_KM,  // feet
      segment.properties.one_way_ca,
      effective_km * FEET_PER_KM,  // feet
    ]);
  }

  writeOrAppendCSV('io', 'input_user_segments', headers, data);
};
