import moment from "moment";

export const getHoursPassed = openTime => {
  const date1 = moment(new Date(openTime));
  const date2 = moment(new Date());
  var diffInHours = date2.diff(date1, "hours");
  var minutes = new Date(openTime).getMinutes() - new Date().getMinutes();
  // var diffInMinutes = date2.diff(date1, "minutes");
  // const res = diffInHours + " : " + minutes;
  const res = diffInHours;
  return res;
};
