import { writeOrAppendCSV } from '../../writeCSV.js';

export default (id, intersections) => {

  const headers = [
    'id',
    'node_id',
    'ped_demand',
    'bicycle_exposure_class',
    'bicycle_node_exposure',
    'pedestrian_exposure_class',
    'pedestrian_node_exposure',
    'functional',
    'population',
    'jobs',
  ];

  const data = [];

  for(let intersection of intersections) {

    data.push([
      id,
      intersection.properties.node_id,
      intersection.properties.ped_demand,
      intersection.properties.bicycle_exposure_class,
      intersection.properties.bicycle_node_exposure,
      intersection.properties.pedestrian_exposure_class,
      intersection.properties.pedestrian_node_exposure,
      intersection.properties.functional,
      intersection.properties.population,
      intersection.properties.jobs,
    ]);
  }

  writeOrAppendCSV('io', 'input_intersections', headers, data);
};
