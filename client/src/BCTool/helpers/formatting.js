export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function readableNumber(number, places = 3, suffix = '') {

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

}