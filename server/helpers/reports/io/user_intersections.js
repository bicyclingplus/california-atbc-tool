import { writeOrAppendCSV } from '../../writeCSV.js';

export default (project_id, count) => {

  const headers = [
    'project_id',
    'count',
  ];

  const data = [
    project_id,
    count,
  ];

  writeOrAppendCSV('io', 'input_user_intersections', headers, [data]);
};
