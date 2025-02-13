import {
  ESTIMATES,
} from '../../benefits/constants.js';

import { writeOrAppendCSV } from '../../writeCSV.js';

export default (id, benefits) => {

  const headers = [
    'id',
    'column',
    'estimate',
    'value',
  ];

  const data = []

  for(let column of ['miles', 'capita', 'jobs']) {
    for(let estimate of ESTIMATES) {
      data.push([
        id,
        column,
        estimate,
        benefits[column][estimate],
      ]);
    }
  }

  writeOrAppendCSV('io', 'output_vmt', headers, data);
};
