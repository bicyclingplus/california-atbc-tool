import {
  ESTIMATES,
} from '../../benefits/constants.js';

import { writeOrAppendCSV } from '../../writeCSV.js';

export default (project_id, benefits) => {

  const headers = [
    'project_id',
    'column',
    'estimate',
    'value',
  ];

  const data = []

  for(let column of ['miles', 'capita', 'jobs']) {
    for(let estimate of ESTIMATES) {
      data.push([
        project_id,
        column,
        estimate,
        benefits[column][estimate],
      ]);
    }
  }

  writeOrAppendCSV('io', 'output_vmt', headers, data);
};
