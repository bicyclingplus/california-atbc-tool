const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const readableNumber = (number, places = 3, suffix = '') => {

  if(Number.isNaN(number)) {
    return "N/A";
  }

  if(number === null) {
    return "N/A";
  }

  if(number < 1 && number > -1) {
    let factor = Math.pow(10, places);

    return numberWithCommas(Math.round((number + Number.EPSILON) * factor) / factor) + suffix;
  }

  return numberWithCommas(Math.round((number + Number.EPSILON))) + suffix;

};

const moneyFmt = (val) => {

  const valAbs = Math.abs(val);

  const formatted = valAbs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return val >= 0 ? `$${formatted}` : `- $${formatted}`;

};

export {
  numberWithCommas,
  readableNumber,
  moneyFmt,
};
