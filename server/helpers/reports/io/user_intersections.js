import { writeOrAppendCSV } from '../../writeCSV.js';

export default (id, count) => {

  const headers = [
    'id',
    'count',
  ];

  const data = [
    id,
    count,
  ];

  writeOrAppendCSV('io', 'input_user_intersections', headers, [data]);

};