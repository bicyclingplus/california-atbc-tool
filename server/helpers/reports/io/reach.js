import { writeOrAppendCSV } from '../../writeCSV.js';

export default (project_id, length, intersections) => {

  const headers = [
    'project_id',
    'length (ft)',
    'intersections',
  ];

  const data = [
    project_id,
    length,
    intersections,
  ];

  writeOrAppendCSV('io', 'output_reach', headers, [data]);
};
