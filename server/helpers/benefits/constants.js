// scale benefits for different levels
// of improvement for project elements
const SCALING_FACTORS = {
    new: 1,
    upgrade: 1,
    retrofit: 0.1,
};

// range of effect for benefits
const ESTIMATES = [
    'lower',
    'mean',
    'upper'
];

// discount rate for calculating benefits
// over the project time frame
const DISCOUNT_RATE = 0.04;

// EMISSIONS

// CO2 equivalents for different emission types
const GWPS = {
  CO2: 1,
  CH4: 28,
  N2O: 265,
};

// vehicle types in county fleets
const VEHICLE_TYPES = [
  'Diesel',
  'Gasoline',
  'Plug-in Hybrid',
];

// emission types of interest
const EMISSION_TYPES = [
  'NOx',
  'PM2.5',
  'PM10',
  'CO2',
  'CH4',
  'N2O',
  'NH3',
  'CO',
  'SOx',
];

// TRAVEL

const INDUCED_TRAVEL = {
    bicycling: 11.8,
    walking: 10.98,
};

const ROUTE_SHIFT = {
    bicycling: 58.81,
    walking: 7.73,
};

const CAR_SHIFT = {
    bicycling: 17.64,
    walking: 33.3,
};

const OTHER_SHIFT = {
    bicycling: 11.75,
    walking: 47.99,
};

// WEIGHTING

const BIKE_WEIGHT = 0.25;
const PED_WEIGHT = 0.3;

// HEALTH

const WALK_SPEED = {
  lower: 1.5,
  mean: 3.0,
  upper: 4.5,
};

const BIKE_SPEED = {
  lower: 5.5,
  mean: 10.0,
  upper: 15.0,
};

const WALK_MMET = {
  lower: 2.0,
  mean: 2.5,
  upper: 7.0,
};

const BIKE_MMET = {
  lower: 2.5,
  mean: 4.8,
  upper: 9.0,
};

// VMT REDUCTIONS

const BIKE_FACTOR = 0.506;

const PED_FACTOR = 0.646;

const CARPOOL_FACTOR = 0.87;

const TRANSIT_FACTOR = 13.67;

const TRANSIT_WALK_FRACTION = {
  hubs: 0.5,
  stops: 0.1,
  none: 0.0,
};

// p power representing the safety in numbers effect
const POWER_SAFETY_IN_NUMBERS = 0.4;
const FUNCTIONAL_CLASSES = ['major_road', 'minor_road', 'local'];
const COLUMNS = ['safety', 'capita', 'jobs'];
const MODES = ['bicycling', 'walking', 'combined'];
const LOCATION_TYPES = ['intersection', 'roadway'];
const VOLUMES = ['low', 'medium', 'high'];
const OUTCOMES = ['crash', 'injury', 'death'];

const VALUE_STATISTICAL_LIFE = 13700000;
const SCC_GROWTH_RATE = 0.02;
const AVG_BIKE_DIST = 1.9;
const AVG_WALK_DIST = 0.55;
const MMET_BASE = 2.43;
const MMET_CAP = 10;
const PROP_SUFF_ACTIVE = 0.163;
const PROP_INSUF_ACTIVE = 1 - PROP_SUFF_ACTIVE;

export {
    SCALING_FACTORS,
    ESTIMATES,
    DISCOUNT_RATE,

    GWPS,
    VEHICLE_TYPES,
    EMISSION_TYPES,

    INDUCED_TRAVEL,
    ROUTE_SHIFT,
    CAR_SHIFT,
    OTHER_SHIFT,

    BIKE_WEIGHT,
    PED_WEIGHT,

    WALK_SPEED,
    BIKE_SPEED,
    WALK_MMET,
    BIKE_MMET,

    BIKE_FACTOR,
    PED_FACTOR,
    CARPOOL_FACTOR,
    TRANSIT_FACTOR,
    TRANSIT_WALK_FRACTION,

    POWER_SAFETY_IN_NUMBERS,
    FUNCTIONAL_CLASSES,
    COLUMNS,
    MODES,
    LOCATION_TYPES,
    VOLUMES,
    OUTCOMES,

    VALUE_STATISTICAL_LIFE,
    SCC_GROWTH_RATE,
    AVG_BIKE_DIST,
    AVG_WALK_DIST,
    MMET_BASE,
    MMET_CAP,
    PROP_INSUF_ACTIVE,
};
