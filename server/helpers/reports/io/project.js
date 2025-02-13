import { writeOrAppendCSV } from '../../writeCSV.js';

export default (id, details, length, intersections) => {

  const headers = [
    'id',
    'name',
    'date',
    'developer',
    'county',
    'cost ($)',
    'timeframe (years)',
    'type',
    'subtype',
    'year',
    'transit',
    'length (ft)',
    'intersections',
  ];

  const data = [
    id,
    details.name,
    details.date,
    details.developer,
    details.county,
    details.cost,
    details.timeframe,
    details.type,
    details.subtype,
    details.year,
    details.transit,
    length,
    intersections,
  ];

  writeOrAppendCSV('io', 'input_project', headers, [data]);
};
