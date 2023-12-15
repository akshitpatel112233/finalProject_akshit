module.exports = (dateString) => {
  let dateObject = new Date(dateString);

  const year = dateObject.getFullYear();

  let month = dateObject.getMonth() + 1;

  month = month < 10 ? `0${month}` : month;

  let date = dateObject.getDate();

  date = date < 10 ? `0${date}` : date;

  return `${year}-${month}-${date}`;
};
