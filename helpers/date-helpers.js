function jsDateConverter(isoFormatDateString) {
  date = new Date(isoFormatDateString);
  year = date.getFullYear();
  month = date.getMonth() + 1;
  dt = date.getDate();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }
  return [year, month, date]
}

module.exports = jsDateConverter 