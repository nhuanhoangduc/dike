app
  .controller('goWithMeCreateCtrl', function(mapServices, restfulServices, $scope, UserServices) {
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
      // add start point to request
      _this.request.start = {
        lat: _this.map.markers.start.lat,
        lng: _this.map.markers.start.lng
      };

      // add end point to request
      _this.request.end = {
        lat: _this.map.markers.end.lat,
        lng: _this.map.markers.end.lng
      };


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

      // update user
      UserServices.getCurrentUser();

    })();
  })
  .controller('goWithMeSearchCtrl', function(mapServices, restfulServices, $scope, UserServices) {
    var _this = this;

    this.map = mapServices;
    this.places = ['hà nội'];

    this.autoComplete = function(place) {
      _this.map.autoComplete(place, function(err, response) {
        _this.places = response.data;
      });
    };

    this.placeSelected = function(name) {
      var marker = this.map.markers[name];

      _this.map.getLocation(marker.place.placeId, function(err, response) {
        var lat = response.data.lat;
        var lng = response.data.lng;

        marker.lat = lat;
        marker.lng = lng;

        // bound to markers
        _this.map.boundMarkers(_this.map.markers.start, _this.map.markers.end);

        // update circle
        _this.map.paths[name].latlngs = [lat, lng];
      });
    };


    /* date picker popup */
    // date format
    this.dateFormat = 'dd-MM-yyyy';

    // user input
    this.altInputFormats = ['dd-MM-yyyy'];

    /* search data */
    this.submit = function() {
      var params = [
        _this.map.markers.start.lat,
        _this.map.markers.start.lng,
        _this.map.markers.start.radius,
        _this.map.markers.end.lat,
        _this.map.markers.end.lng,
        _this.map.markers.end.radius
      ];

      restfulServices.get('/map/gowithmesearch', params, function(err, response) {
        if (err)
          console.log(err);

        for (var key in _this.map.markers) {
          if (key !== 'start' && key !== 'end')
            delete _this.map.markers[key];
        }

        // draw marker results
        for (var i = 0; i < response.data.length; i++) {
          var marker = response.data[i];

          _this.map.markers[i + '_start'] = {
            lat: marker.start.lat,
            lng: marker.start.lng
          };

          _this.map.markers[i + '_end'] = {
            lat: marker.end.lat,
            lng: marker.end.lng
          };
        }

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
      //_this.map.boundMarkers(_this.map.markers.start, _this.map.markers.end);

      // set text field data
      setTextField(_this.map.markers[control.modelName], control.model.lat, control.model.lng);

      // update circle
      _this.map.paths[control.modelName].latlngs = [control.model.lat, control.model.lng];

      // request to server
      _this.submit();
    });


    /* radius change event */
    this.radiusChanged = function(name) {
      // update circle
      _this.map.paths[name].radius = _this.map.markers[name].radius / 2;
    };


    /* init function */
    (function() {

      // init data for start text field
      setTextField(_this.map.markers.start, _this.map.markers.start.lat, _this.map.markers.start.lng);

      // init data for end text field
      setTextField(_this.map.markers.end, _this.map.markers.end.lat, _this.map.markers.end.lng);

      // update user
      UserServices.getCurrentUser();

      // add start circle
      _this.map.paths.start = {
        type: "circle",
        color: "green",
        radius: _this.map.markers.start.radius / 2,
        latlngs: [_this.map.markers.start.lat, _this.map.markers.start.lng]
      };

      // add end circle
      _this.map.paths.end = {
        type: "circle",
        color: "red",
        radius: _this.map.markers.end.radius / 2,
        latlngs: [_this.map.markers.end.lat, _this.map.markers.end.lng]
      };

    })();


  });
