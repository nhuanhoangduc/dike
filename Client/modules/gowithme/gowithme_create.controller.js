app
  .controller('goWithMeCreateCtrl', function(mapServices, restfulServices, $scope, UserServices, toastr, $stateParams, $state) {
    var _this = this;

    this.map = mapServices;
    this.places = ['hà nội'];
    this.request = {};
    this.request.startTime = new Date();
    this.id = $stateParams.id;

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

      if (_this.id) { // update

        restfulServices.put('/travel', _this.request, function(err, response) {
          if (err)
            return toastr.error(err.data.message ? err.data.message : err.data, 'Error');

          toastr.success('Event has updated', 'Success!');
          $state.go('post', { type: 'travel', eventId: _this.id }, { reload: true });
        });

      } else { // add new

        restfulServices.post('/travel', _this.request, function(err, response) {
          if (err)
            return toastr.error(err.data.message ? err.data.message : err.data, 'Error');

          toastr.success('Event has added', 'Success!');
          $state.go('post', { type: 'travel', eventId: response.data._id }, { reload: true });
        });

      }

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
      UserServices.getCurrentUser(function() {});

      // delete current marker
      for (var key in _this.map.markers) {
        if (key !== 'start' && key !== 'end')
          delete _this.map.markers[key];
      }

      if (_this.id) {
        restfulServices.get('/travel', [_this.id], function(err, response) {
          if (err)
            return toastr.error(err.data.message, 'Error');
          console.log(response.data);

          delete response.data.commentUsers;
          _this.request = response.data;

          _this.map.markers.start.lat = _this.request.start.lat;
          _this.map.markers.start.lng = _this.request.start.lng;

          _this.map.markers.end.lat = _this.request.end.lat;
          _this.map.markers.end.lng = _this.request.end.lng;

          // init data for start text field
          setTextField(_this.map.markers.start, _this.map.markers.start.lat, _this.map.markers.start.lng);

          // init data for end text field
          setTextField(_this.map.markers.end, _this.map.markers.end.lat, _this.map.markers.end.lng);

          _this.request.startTime = new Date(_this.request.startTime);
        });
      }

    })();
  });
