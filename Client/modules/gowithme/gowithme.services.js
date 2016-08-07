app
  .factory('GoWithMeServices', function(toastr, moment) {

    // rebuild data for target array with source array
    var refreshArr = function(source, target) {
      target.splice(0, target.length);

      for (var i = 0; i < source.length; i++) {
        target.push(source[i]);
      }

    };

    var services = {

      // suggest places from input place
      autoComplete: function(map, place, returnArray) {
        map.autoComplete(place, function(err, res) {

          if (err)
            return toastr.error('Check your connection', 'Error');

          refreshArr(res.data, returnArray);

        });
      },

      // user choose a place from suggested places
      placeSelected: function(map, marker) {
        map.getLocation(marker.place.placeId, function(err, response) {
          if (err)
            return toastr.error('Check your connection, can not get place', 'Error');

          var lat = response.data.lat;
          var lng = response.data.lng;

          marker.lat = lat;
          marker.lng = lng;

          // bound to markers
          map.boundMarkers(map.markers.start, map.markers.end);
        });
      },

      // after user drag a marker, then set marker.place to display place
      setTextField: function(map, marker) {
        if (!marker.place)
          marker.place = {};

        // get geo code
        map.geoCode(marker.lat, marker.lng, function(err, res) {
          if (err)
            return toastr.error('Check your connection, can not get lat lng', 'Error');
          marker.place.name = res.data.slice(0, 34);
        });
      },

      // parse date data to string that people can easy to read information
      getFormatedDate: function(date) {
        return moment(date).format('HH:mm DD-MM-YYYY');
      },

      // convert lat lng to place 
      getGeoCode: function(map, start, end) {
        start.place = '';
        end.place = '';

        map.geoCode(start.lat, start.lng, function(err, response) {
          start.place = response.data;
        });

        map.geoCode(end.lat, end.lng, function(err, response) {
          end.place = response.data;
        });
      }

    };

    return services;

  });
