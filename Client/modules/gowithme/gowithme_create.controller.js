app
  .controller('goWithMeCreateCtrl', function(mapServices, restfulServices, $scope, UserServices, toastr, $stateParams, $state, GoWithMeServices) {
    var _this = this;

    this.map = mapServices;
    this.places = ['hà nội'];
    this.request = {};
    this.request.finishTime = new Date();
    this.id = $stateParams.id;
    this.services = GoWithMeServices;
    this.user = UserServices.user;


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

        restfulServices.put('/event/travel', _this.request, function(err, response) {
          if (err)
            return toastr.error(err.data.message ? err.data.message : err.data, 'Error');

          toastr.success('Event has updated', 'Success!');
          $state.go('post', { type: 'travel', eventId: _this.id }, { reload: true });
        });

      } else { // add new

        restfulServices.post('/event/travel', _this.request, function(err, response) {
          if (err)
            return toastr.error(err.data.message ? err.data.message : err.data, 'Error');

          toastr.success('Event has added', 'Success!');
          $state.go('post', { type: 'travel', eventId: response.data._id }, { reload: true });
        });

      }

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
      _this.services.setTextField(_this.map, _this.map.markers[control.modelName]);

    });


    /* init function */
    (function() {

      // init data for start text field
      _this.services.setTextField(_this.map, _this.map.markers.start);

      // init data for end text field
      _this.services.setTextField(_this.map, _this.map.markers.end);

      // update user
      UserServices.getCurrentUser(function() {});

      // delete current marker
      for (var key in _this.map.markers) {
        if (key !== 'start' && key !== 'end')
          delete _this.map.markers[key];
      }

      if (_this.id) {
        restfulServices.get('/event/travel', [_this.id], function(err, response) {
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
          _this.services.setTextField(_this.map, _this.map.markers.start);

          // init data for end text field
          _this.services.setTextField(_this.map, _this.map.markers.end);

          _this.request.finishTime = new Date(_this.request.finishTime);
        });
      }

    })();
  });
