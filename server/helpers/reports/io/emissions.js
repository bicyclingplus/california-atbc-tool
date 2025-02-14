import {
  ESTIMATES,
  EMISSION_TYPES,
} from '../../benefits/constants.js';

import { writeOrAppendCSV } from '../../writeCSV.js';

export default (project_id, benefits) => {

  const headers = [
    'project_id',
    'column',
    'item',
    'estimate',
    'value',
  ];

  const data = []

  for(let column of ['miles', 'capita', 'jobs']) {
    for(let emission_type of EMISSION_TYPES) {
      for(let estimate of ESTIMATES) {
        data.push([
          project_id,
          column,
          emission_type,
          estimate,
          benefits[column].reductions[emission_type][estimate],
        ]);
      }
    }

    for(let estimate of ESTIMATES) {
      data.push([
        project_id,
        column,
        'equivalent',
        estimate,
        benefits[column].equivalent[estimate],
      ]);
    }
  }

  writeOrAppendCSV('io', 'output_emissions', headers, data);
};