app
  .controller('goWithMeCreateCtrl', function(mapServices, restfulServices, $scope, UserServices, toastr) {
    var _this = this;

    this.map = mapServices;
    this.places = ['hà nội'];
    this.request = {};
    this.request.startTime = new Date();

    this.autoComplete = function(place) {
      _this.map.autoComplete(place, function(err, response) {
        if (err)
          return toastr.error('Check your connection', 'Error');
        _this.places = response.data;
      });
    };

    this.placeSelected = function(marker) {
      _this.map.getLocation(marker.place.placeId, function(err, response) {
        if (err)
          return toastr.error('Check your connection, can not get place', 'Error');

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

      restfulServices.post('/travel', _this.request, function(err, response) {
        if (err)
          return toastr.error(err.data.message ? err.data.message : err.data, 'Error');

        toastr.success('Event has added', 'Success!');
      });
    };

    /* set text field data from lat lng*/
    var setTextField = function(marker, lat, lng) {
      if (!marker.place)
        marker.place = {};

      // get geo code
      _this.map.geoCode(lat, lng, function(err, response) {
        if (err)
          return toastr.error('Check your connection, can not get lat lng', 'Error');
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

      // delete current marker
      for (var key in _this.map.markers) {
        if (key !== 'start' && key !== 'end')
          delete _this.map.markers[key];
      }

    })();
  })
  .controller('goWithMeSearchCtrl', function(mapServices, restfulServices, $scope, UserServices, $q) {
    var _this = this;

    this.map = mapServices;
    this.places = ['hà nội'];
    this.searchResults = [];
    this.request = {};
    this.request.startTime = new Date();
    this.request.endTime = new Date();
    this.moment = moment;


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

        // update results
        _this.submit();
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
        _this.map.markers.end.radius,
        _this.request.startTime,
        _this.request.endTime
      ];

      restfulServices.get('/map/travelsearch', params, function(err, response) {
        if (err)
          return toastr.error('Check your connection', 'Error');

        _this.searchResults = response.data;

        // delete current marker
        for (var key in _this.map.markers) {
          if (key !== 'start' && key !== 'end')
            delete _this.map.markers[key];
        }

        // draw marker results
        for (var i = 0; i < _this.searchResults.length; i++) {
          var marker = _this.searchResults[i];

          // draw start point
          _this.map.markers[i + '_start'] = {
            lat: marker.start.lat,
            lng: marker.start.lng
          };

          // draw end point
          _this.map.markers[i + '_end'] = {
            lat: marker.end.lat,
            lng: marker.end.lng
          };
        }

      });
    };

    /* convert lat lng to place  */
    this.getGeoCode = function(point) {
      point.place = '';

      _this.map.geoCode(point.lat, point.lng, function(err, response) {
        point.place = response.data;
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

      // update results
      _this.submit();
    };


    // parse date data to string that people can easy to read information
    this.getFormatedDate = function(date) {
      return _this.moment(date).format('HH:mm, DD-MM-YYYY');
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

      // request to server
      _this.submit();

    })();


  });
