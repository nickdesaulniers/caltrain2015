var parse = require('csv-parse');
var XMLHttpRequestPromise = require('xhr-promise');

var prefix = 'gtfs_caltrain_devs/';
var csvs = [
  prefix + 'stops.txt',
  prefix + 'stop_times.txt',
  prefix + 'calendar.txt'
];

var xhrPromises = csvs.map(function (url) {
  var xhrPromise = new XMLHttpRequestPromise;
  return xhrPromise.send({
    method: 'get',
    url: url,
  });
});

function parsePromise (response) {
  return new Promise(function (resolve, reject) {
    parse(response.responseText, { columns: true }, function (err, obj) {
      err ? reject(err) : resolve(obj);
    });
  });
};

function noExt (path) {
  var match = path.match(/(\w+)/g);
  return match && match.length > 1 ? match[match.length - 2] : '';
};

function zipObject (keys, values) {
  if (keys.length !== values.length) throw new Error('unable to zipObject');
  var obj = {};
  for (var i = 0; i < keys.length; ++i) obj[noExt(keys[i])] = values[i];
  return obj;
};

function getCSVData (cb) {
  Promise.all(xhrPromises).then(function (responses) {
    return Promise.all(responses.map(parsePromise));
  }).then(function (r) {
    cb(null, zipObject(csvs, r));
  }).catch(function (e) {
    cb(e, null);
  });
};

module.exports = getCSVData;

