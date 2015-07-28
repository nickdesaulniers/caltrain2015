var caltrainTimeToDate = require('./helpers').caltrainTimeToDate;

// All DOM interactions must go through here

function createOption (value, stopId) {
  var option = document.createElement('option');
  option.textContent = value;
  option.value = stopId;
  return option;
};

function buildSelect (stops) {
  var select = document.createElement('select');
  for (var i = 0; i < stops.length; ++i) {
    if (stops[i].platform_code !== 'NB') continue;
    var option = createOption(stops[i].stop_name, stops[i].stop_id);
    select.appendChild(option);
  }
  document.body.appendChild(select);
  return select;
};

function updateTimeTable (data, e) {
  console.log(data, e);
};

function timeStr (calTrainTime) {
  return caltrainTimeToDate(calTrainTime).toLocaleTimeString();
};

function showResults (results) {
  console.log(results);
  for (var i = 0; i < results.length; ++i) {
    var p = document.createElement('p');
    p.textContent = timeStr(results[i].start) + ' <> ' +
      timeStr(results[i].end);
    document.body.appendChild(p);
  }
};

module.exports = {
  buildSelect: buildSelect,
  updateTimeTable: updateTimeTable,
  showResults: showResults,
};
