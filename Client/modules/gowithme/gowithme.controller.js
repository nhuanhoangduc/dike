app
  .controller('goWithMeCreateCtrl', function(mapServices, restfulServices, $scope) {
    var _this = this;

    this.map = mapServices;
    this.places = ['hà nội'];
    this.request = {};

    this.autoComplete = function(place) {
      _this.map.autoComplete(place, function(err, response) {
        _this.places = response.data;
      });
    };

    this.placeSelected = function(marker) {
      _this.map.getLocation(marker.place.placeId, function(err, response) {
        var lat = response.data.lat;
        var lng = response.data.lng;

        marker.lat = lat;
        marker.lng = lng;

        // bound to markers
        _this.map.boundMarkers(_this.map.markers.start, _this.map.markers.end);
      });
    };


    /* date picker popup */
    // date format
    this.dateFormat = 'dd-MM-yyyy';

    // user input
    this.altInputFormats = ['dd-MM-yyyy'];

    /* submit data */
    this.submit = function() {
      restfulServices.post('/gowithme', _this.request, function(err, response) {
        if (err)
          console.log(err);

        console.log(response);
      });
    };

    /* set text field data from lat lng*/
    var setTextField = function(marker, lat, lng) {
      if (!marker.place)
        marker.place = {};

      // get geo code
      _this.map.geoCode(lat, lng, function(err, response) {
        marker.place.name = response.data.slice(0, 34);
      });
    };

    // set event dragend to marker
    $scope.$on('leafletDirectiveMarker.dragend', function(event, control) {
      // set marker data
      _this.map.markers[control.modelName].lat = control.model.lat;
      _this.map.markers[control.modelName].lng = control.model.lng;
      _this.map.markers[control.modelName].focus = true;

      // bound to markers
      _this.map.boundMarkers(_this.map.markers.start, _this.map.markers.end);

      // set text field data
      setTextField(_this.map.markers[control.modelName], control.model.lat, control.model.lng);
    });


    /* init function */
    (function() {

      // init data for start text field
      setTextField(_this.map.markers.start, _this.map.markers.start.lat, _this.map.markers.start.lng);

      // init data for end text field
      setTextField(_this.map.markers.end, _this.map.markers.end.lat, _this.map.markers.end.lng);

    })();
  })
  .controller('goWithMeSearchCtrl', function(mapServices, restfulServices) {
    var _this = this;

    this.map = mapServices;
    this.places = ['hà nội'];
    this.request = {};

    this.autoComplete = function(place) {
      _this.map.autoComplete(place, function(err, response) {
        _this.places = response.data;
      });
    };

    this.placeSelected = function(marker) {
      _this.map.getLocation(marker.place.placeId, function(err, response) {
        var lat = response.data.lat;
        var lng = response.data.lng;

        marker.lat = lat;
        marker.lng = lng;

        // bound to markers
        _this.map.boundMarkers(_this.map.markers.start, _this.map.markers.end);
      });
    };


    /* date picker popup */
    // date format
    this.dateFormat = 'dd-MM-yyyy';

    // user input
    this.altInputFormats = ['dd-MM-yyyy'];

    /* submit data */
    this.submit = function() {
      restfulServices.post('/gowithme', _this.request, function(err, response) {
        if (err)
          console.log(err);

        console.log(response);
      });
    };
  });
