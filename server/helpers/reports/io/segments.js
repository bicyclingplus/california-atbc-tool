import { writeOrAppendCSV } from '../../writeCSV.js';
import * as turf from "@turf/turf";

const FEET_PER_KM = 3280.84;

export default (project_id, segments) => {

  const headers = [
    'project_id',
    'edge_uid',
    'length (ft)',
    'oneway',
    'effective length (ft)',
    'bicyclist_demand',
    'bicycle_exposure_class',
    'bicyclist_link_exposure',
    'pedestrian_link_exposure_class',
    'pedestrian_link_exposure',
    'functional',
    'population',
    'jobs',
  ];

  const data = [];

  for(let segment of segments) {

    const length_km = turf.length(segment);

    // currently no doubling for two way roads,
    // see client/src/BCTool/ProjectMap/ProjectMap.js:L210
    // const effective_km = segment.properties.one_way_ca === '1' ? length_km : length_km * 2;
    const effective_km = length_km;

    data.push([
      project_id,
      segment.properties.edge_uid,
      length_km * FEET_PER_KM, // feet
      segment.properties.one_way_ca,
      effective_km * FEET_PER_KM, // feet
      segment.properties.bicyclist_demand,
      segment.properties.bicycle_exposure_class,
      segment.properties.bicyclist_link_exposure,
      segment.properties.pedestrian_link_exposure_class,
      segment.properties.pedestrian_link_exposure,
      segment.properties.functional,
      segment.properties.population,
      segment.properties.jobs,
    ]);
  }

  writeOrAppendCSV('io', 'input_segments', headers, data);
};
