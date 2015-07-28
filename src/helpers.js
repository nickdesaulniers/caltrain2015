function caltrainTimeToDate (calTrainTime) {
  var d = new Date;
  d.setHours.apply(d, calTrainTime.split(':'));
  return d;
};

module.exports = {
  caltrainTimeToDate: caltrainTimeToDate,
};

