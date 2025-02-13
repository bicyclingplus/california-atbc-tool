import { writeOrAppendCSV } from '../../writeCSV.js';
import {
  MODES,
  OUTCOMES,
  LOCATION_TYPES,
} from '../../benefits/constants.js';

export default (id, safety) => {

  const headers = [
    'id',
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
          id,
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
