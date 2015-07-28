var caltrainTimeToDate = require('./helpers').caltrainTimeToDate;

// TODO: memoize today's date
// mock out the time to consistently be 10:30am
function mockDate () {
  var d = new Date;
  //d.setHours(10);
  //d.setMinutes(30);
  return d;
};

function notTooLate (arrivalTime) {
  var now = mockDate();
  var train = caltrainTimeToDate(arrivalTime);
  //console.log(train.toLocaleTimeString(), now.toLocaleTimeString(), now < train);
  return now < train;
  //return mockDate() < caltrainTimeToDate(arrivalTime);
};

function removeNoEndTrips (trip) {
  return trip.length === 2;
};

// assumes (new Date).getDay() is 0 index? idk
var calendarKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday",
  "friday", "saturday"];
function tripIsToday (trip, calendar) {
  var today = new Date;

  var calendarTrip = calendar.find(function (calTrip) {
    return calTrip.service_id === trip.replace(/^\d+-/, '');
  });

  //var isToday = calendarTrip[calendarKeys[(new Date).getDay()]] > 0;

  //console.log(trip, calendarTrip, (new Date).getDay(),
              //calendarTrip[calendarKeys[(new Date).getDay()]], isToday);

  //return isToday;
  return calendarTrip[calendarKeys[(new Date).getDay()]] > 0;
};

function filter (data, start, end) {
  var stops = data.stop_times;
  // keys are trip_id
  var trips = {};

  for (var i = 0, len = stops.length; i < len; ++i) {
    var stop = stops[i];

    if (stop.stop_id === start && !(stop.trip_id in trips) &&
        notTooLate(stop.arrival_time) &&
        tripIsToday(stop.trip_id, data.calendar)) {
      trips[stop.trip_id] = [stop];
    }

    if (stop.stop_id === end && stop.trip_id in trips &&
        notTooLate(stop.arrival_time) &&
        tripIsToday(stop.trip_id, data.calendar)) {
      trips[stop.trip_id].push(stop);
    }

  }

  //console.log(trips);

  var pairs = [];
  Object.keys(trips).forEach(function (key) {
    var trip = trips[key];
    if (trip.length !== 2) {
      return;
    }
    pairs.push({
      start: trip[0].arrival_time,
      end: trip[1].arrival_time,
    });
  });
  pairs.sort(function (a, b) {
    //console.log(a, b);
    return caltrainTimeToDate(a.start) > caltrainTimeToDate(b.start);
  });
  //console.log(pairs);
  return pairs;
};

module.exports = filter;
