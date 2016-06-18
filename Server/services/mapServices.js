var request = require('request');
var key = 'AIzaSyDAJenglprl19UfLIr2vXugmM1BMqWFJME';

var autoComplete = function(place) {
  return function(req, res, next) {
    var this_place = req.place | place;

    var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + this_place + '&key=' + key;
    process.nextTick(function() {
      request(url, function(error, response, body) {
        if (error) {
          return next(error);
        }

        var mapData = JSON.parse(body);
        var places = [];

        for (var i = 0; i < mapData.predictions.length; i++) {
          places.push(mapData.predictions[i].description);
        }

        return res.json(places);
      });
    });
  }
};


module.exports = {
  autoComplete: autoComplete
};
