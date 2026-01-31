import calcReach from './calcReach.js';
import calcDemand from './calcDemand.js';
import calcBenefits from './calcBenefits.js';
import calcMonetary from './calcMonetary.js';

const calcAll = async (
  selectedWayIds,
  selectedIntersectionIds,
  userWays,
  userIntersections,
  type,
  subtype,
  county,
  year,
  timeframe,
  transit,
  selectedInfrastructure,
  selectedNonInfrastructure,
  safety,
) => {

  const reach = await calcReach(
    selectedWayIds,
    selectedIntersectionIds,
    userWays,
    userIntersections,
  );

  const {
    selectedWays,
    selectedIntersections,
    totalLength,
    totalIntersections,
    hasOnlyUserMapSelections,
  } = reach;

  const existingTravel = await calcDemand(
    selectedWays,
    userWays,
    selectedIntersections,
    userIntersections,
    totalLength,
  );

  const benefits = calcBenefits(
    type,
    subtype,
    county,
    year,
    timeframe,
    transit,
    totalLength,
    totalIntersections,
    existingTravel,
    selectedInfrastructure,
    selectedNonInfrastructure,
    hasOnlyUserMapSelections,
    selectedWays,
    selectedIntersections,
    safety,
  );

  // leave off for now, but it is integrated end to end
  // benefits.monetary = await calcMonetary(
  //   year,
  //   timeframe,
  //   county,
  //   userWays,
  //   userIntersections,
  //   reach,
  //   benefits,
  // );

  return {
    reach,
    existingTravel,
    benefits,
  }

};

export default calcAll;
