app
  .controller('goWithMeSearchCtrl', function(mapServices, restfulServices, $scope, UserServices, $q, $stateParams, toastr, GoWithMeServices) {
    var _this = this;
    var id = $stateParams.id;


    this.map = mapServices;
    this.places = ['hà nội'];
    this.searchResults = [];
    this.request = {};
    this.request.startTime = new Date();
    this.request.endTime = new Date();
    this.moment = moment;
    this.services = GoWithMeServices;

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
      delete _this.map.paths.direction;

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
        console.log(response.data);

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
    

    // set event dragend to marker
    $scope.$on('leafletDirectiveMarker.dragend', function(event, control) {
      // set marker data
      _this.map.markers[control.modelName].lat = control.model.lat;
      _this.map.markers[control.modelName].lng = control.model.lng;
      _this.map.markers[control.modelName].focus = true;

      // bound to markers
      //_this.map.boundMarkers(_this.map.markers.start, _this.map.markers.end);

      // set text field data
      _this.services.setTextField(_this.map, _this.map.markers[control.modelName]);

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

      if (id) {

        restfulServices.get('/travel/public', [id], function(err, res) {
          if (err)
            return toastr.error(err.message, 'Lỗi');

          var travel = res.data;
          _this.searchResults.push(travel);

          _this.map.markers.start.lat = travel.start.lat;
          _this.map.markers.start.lng = travel.start.lng;
          _this.map.markers.start.radius = 2;

          _this.map.markers.end.lat = travel.end.lat;
          _this.map.markers.end.lng = travel.end.lng;
          _this.map.markers.end.radius = 2;

          // init data for start text field
          _this.services.setTextField(_this.map, _this.map.markers.start);

          // init data for end text field
          _this.services.setTextField(_this.map, _this.map.markers.end);

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

          // bound to markers
          _this.map.boundMarkers(_this.map.markers.start, _this.map.markers.end);

          restfulServices.get('/map/direction', [travel.start.lat, travel.start.lng, travel.end.lat, travel.end.lng], function(err, res) {
            if (err)
              return;
            console.log(res.data);
            _this.map.paths.direction = {
              color: 'red',
              weight: 5,
              latlngs: res.data.points,
              message: '<p>Distance: ' + res.data.distance + ' - Duration: ' + res.data.duration + '</p>'
            };
          });

        });

      } else {

        // init data for start text field
        _this.services.setTextField(_this.map, _this.map.markers.start);

        // init data for end text field
        _this.services.setTextField(_this.map, _this.map.markers.end);

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

      }

      // update user
      UserServices.getCurrentUser(function() {});

    })();


  });
