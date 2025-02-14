import { writeOrAppendCSV } from '../../writeCSV.js';
import {
  MODES,
  OUTCOMES,
  LOCATION_TYPES,
} from '../../benefits/constants.js';

export default (project_id, safety) => {

  const headers = [
    'project_id',
    'mode',
    'outcome',
    'location',
    'value',
  ];

  const data = [];

  for(let mode of MODES) {
    for(let outcome of OUTCOMES) {
      for(let location of LOCATION_TYPES) {
        data.push([
          project_id,
          mode,
          outcome,
          location,
          safety[mode][outcome][location],
        ])
      }
    }
  }

  writeOrAppendCSV('io', 'input_safety', headers, data);
};
