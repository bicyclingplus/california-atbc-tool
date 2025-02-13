// id
// mode
// increase lower/mean/upper
// increase/capita lower/mean/upper
// increase/jobs lower/mean/upper

import {
  ESTIMATES,
} from '../../benefits/constants.js';

import { writeOrAppendCSV } from '../../writeCSV.js';

export default (id, benefits) => {

  const headers = [
    'id',
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
          id,
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
