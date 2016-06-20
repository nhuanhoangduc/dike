var request = require('request');
var key = 'AIzaSyDAJenglprl19UfLIr2vXugmM1BMqWFJME';

var autoComplete = function(req, res, next) {
  var place = 'ha noi';

  if (req.params.place) {
    place = req.params.place;
  }

  var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + place + '&key=' + key;
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


module.exports = {
  autoComplete: autoComplete,
  getDetail: getDetail
};
