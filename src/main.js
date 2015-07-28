var getCSVData = require('./csv_loader');
var UI = require('./ui');
var filter = require('./filters');

function update (data) {
  var start = document.getElementsByTagName('select')[0].value;
  var end = document.getElementsByTagName('select')[1].value;
  //console.log(start, '<>', end);
  var pairs = filter(data, start, end);
  UI.showResults(pairs);
};

getCSVData(function (err, data) {
  if (err) return console.error(err);
  //console.log(data);
  var start = UI.buildSelect(data.stops);
  var end = UI.buildSelect(data.stops);

  start.addEventListener('change', update.bind(null, data));
  end.addEventListener('change', update.bind(null, data));
});
