var request = require('request');
var key = 'AIzaSyDAJenglprl19UfLIr2vXugmM1BMqWFJME';
var urlencode = require('urlencode');
var GoWithMe = require('../models/goWithMe');
var async = require('async');
var _ = require('underscore');


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
  var endParams = [req.params.endLat, req.params.endLng];

  var startRadius = req.params.startRadius;
  var endRadius = req.params.endRadius;

  async.waterfall([

    // search start point
    function(done) {
      GoWithMe.find({
        start: {
          $near: startParams,
          $maxDistance: (startRadius / 35) / 6371
        }
      }, function(err, results) {
        return done(err, results);
      })
    },

    // search end point
    function(startResults, done) {
      GoWithMe.find({
        end: {
          $near: endParams,
          $maxDistance: (endRadius / 35) / 6371
        }
      }, function(err, endResults) {
        if (err)
          return done(err);

        if (startResults.length === 0 || endResults.length === 0)
          return done(null, []);

        var results = [];
        endResults = _.sortBy(endResults, '_id');

        // filter
        for (var i = 0; i < startResults.length; i++) {
          var id = startResults[i]._id;
          var index = _.sortedIndex(endResults, { _id: id });

          if (id.toString() === endResults[index]._id.toString()) {
            results.push(startResults[i]);
          }
        }

        return done(null, results);
      })
    }

  ], function(err, results) {
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
