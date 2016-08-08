app
  .controller('HomeCtrl', function(mapServices, toastr, $state, $window) {

    var _this = this;
    this.places = [];

    this.autoComplete = function(place) {
      mapServices.autoComplete(place, function(err, response) {
        _this.places = response.data;
      });
    };

    this.placeSelected = function(object) {

      mapServices.getLocation(object.placeId, function(err, response) {

        if (err)
          toastr.error(err.message, 'Error');

        object.lat = response.data.lat;
        object.lng = response.data.lng;

      });
    };


    this.submit = function() {

      if (this.start && this.end) {

        var url = 'http://' + $window.location.host + '/#/gowithme?startLat=' + this.start.lat + '&startLng=' + this.start.lng + '&endLat=' + this.end.lat + '&endLng=' + this.end.lng;
        $window.open(url);

      }

    };

  });