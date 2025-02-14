import { writeOrAppendCSV } from '../../writeCSV.js';
import {
  COLUMNS,
  MODES,
  OUTCOMES,
  ESTIMATES,
} from '../../benefits/constants.js';

export default (project_id, benefits) => {

  const headers = [
    'project_id',
    'column',
    'item',
    'mode',
    'outcome',
    'estimate',
    'value',
  ];

  const data = [];

  for(let column of COLUMNS) {

    for(let mode of MODES) {
      for(let outcome of OUTCOMES) {
        data.push([
          project_id,
          column,
          'before',
          mode,
          outcome,
          'N/A',
          benefits[column].before[mode][outcome],
        ]);
      }
    }

    for(let item of ['after', 'change']) {
      for(let mode of MODES) {
        for(let outcome of OUTCOMES) {
          for(let estimate of ESTIMATES) {
            data.push([
              project_id,
              column,
              item,
              mode,
              outcome,
              estimate,
              benefits[column][item][mode][outcome][estimate],
            ]);
          }
        }
      }
    }
  }

  writeOrAppendCSV('io', 'output_quantitative', headers, data);
};
