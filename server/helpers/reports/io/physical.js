import {
  ESTIMATES,
} from '../../benefits/constants.js';

import { writeOrAppendCSV } from '../../writeCSV.js';

export default (project_id, benefits) => {

  const headers = [
    'project_id',
    'column',
    'mode',
    'estimate',
    'value',
  ];

  const data = []

  for(let column of ['miles', 'capita', 'jobs']) {
    for(let mode of ['pedestrian', 'bike', 'total']) {
      for(let estimate of ESTIMATES) {
        data.push([
          project_id,
          column,
          mode,
          estimate,
          benefits[column][mode][estimate],
        ]);
      }
    }
  }

  writeOrAppendCSV('io', 'output_physical', headers, data);
};
