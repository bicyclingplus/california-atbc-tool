// GENERAL

const PROJECT_TYPES = {
    infrastructure: 'Infrastructure',
    'non-infrastructure': 'Non-Infrastructure',
    both: 'Infrastructure and Non-Infrastructure',
};

const PROJECT_SUBTYPES = {
    'pedestrian-only': 'Pedestrian Only',
    'bike-only': 'Bicyclist Only',
    both: 'Pedestrian and Bicyclist',
};

const TRANSIT_TYPES = {
    hubs: 'Connections to major transit hub(s)',
    stops: 'Connections to transit stops',
    none: 'no transit connections',
};

const MODES = ['bicycling', 'walking'];
const LOCATION_TYPES = ['intersection', 'roadway'];
const OUTCOMES = ['crash', 'injury', 'death'];

export {
    PROJECT_TYPES,
    PROJECT_SUBTYPES,
    TRANSIT_TYPES,

    MODES,
    LOCATION_TYPES,
    OUTCOMES,
};
