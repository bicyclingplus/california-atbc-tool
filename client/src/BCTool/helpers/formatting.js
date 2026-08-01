const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const _format = (val, places, style="decimal") => {
  return val.toLocaleString('en-US', {
    minimumFractionDigits: places,
    maximumFractionDigits: places,
    style,
    currency: "USD",
  });
}

const readableNumber = (val, places, places2, suffix = '') => {

  if(Number.isNaN(val)) {
    return "ERR";
  }

  if(val === null) {
    return "N/A";
  }

  if(val < 10) {
    return _format(val, places ?? 3) + suffix;
  }

  return _format(val, places2 ?? 0) + suffix;
};

const moneyFmt = (val, places) => {
  return _format(val, places ?? 2, "currency");
};

export {
  numberWithCommas,
  readableNumber,
  moneyFmt,
};
