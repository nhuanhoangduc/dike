var request = require('request');
var key = 'AIzaSyDAJenglprl19UfLIr2vXugmM1BMqWFJME';
var urlencode = require('urlencode');
var GoWithMe = require('../models/goWithMe');


var autoComplete = function(req, res, next) {
  var place = 'ha noi';

  if (req.params.place) {
    place = req.params.place;
  }

  var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + urlencode(place) + '&key=' + key;
  process.nextTick(function() {
    request(url, function(error, response, body) {
      if (error) {
        return next(error);
      }

      var mapData = JSON.parse(body);
      var places = [];

      for (var i = 0; i < mapData.predictions.length; i++) {
        places.push({
          name: mapData.predictions[i].description,
          placeId: mapData.predictions[i].place_id
        });
      }

      return res.json(places);
    });
  });

};


var getDetail = function(req, res, next) {
  if (!req.params.placeId) {
    return next('placeId null');
  }

  placeId = req.params.placeId;

  var url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + placeId + '&key=' +
    key;

  process.nextTick(function() {
    request(url, function(error, response, body) {
      if (error) {
        return next(error);
      }

      var mapData = JSON.parse(body);
      var location = mapData.result.geometry.location;

      return res.json(location);
    });
  });
};


var geoCode = function(req, res, next) {
  var lat = req.params.lat;
  var lng = req.params.lng;

  var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng;
  url += '&key=' + key;

  // request to google geocode api
  process.nextTick(function() {
    request(url, function(error, response, body) {
      if (error) {
        return next(error);
      }

      var mapData = JSON.parse(body);

      return res.send(mapData.results[0].formatted_address);
    });
  });
};


var search_goWithMe = function(req, res, next) {
  var startParams = [req.params.startLat, req.params.startLng];
  console.log(startParams);
  console.log(req.params.startRadius);

  GoWithMe
    .find({
      start: {
        $near: startParams,
        $maxDistance: (req.params.startRadius / 17.69) / 6371
      }
    }, function(err, results) {
      if (err)
        return next(err);

      res.json(results);
    });

};


module.exports = {
  autoComplete: autoComplete,
  getDetail: getDetail,
  geoCode: geoCode,
  search_goWithMe: search_goWithMe
};
