app
  .controller('TripViewCtrl', function($scope, $uibModalInstance, id, mapServices, restfulServices, GoWithMeServices) {
    var _this = this;
    var id = id;


    this.map = mapServices;
    this.moment = moment;
    this.services = GoWithMeServices;
    this.id = id;


    this.closeModal = function() {
      $uibModalInstance.dismiss();
    };


    /* init function */
    (function() {

      if (id) {

        restfulServices.get('/event/travel/public', [id], function(err, res) {
          if (err)
            return toastr.error(err.message, 'Lỗi');

          var travel = res.data;

          _this.map.markers.start.lat = travel.start.lat;
          _this.map.markers.start.lng = travel.start.lng;
          _this.map.markers.start.radius = 2;

          _this.map.markers.end.lat = travel.end.lat;
          _this.map.markers.end.lng = travel.end.lng;
          _this.map.markers.end.radius = 2;

          // bound to markers
          _this.map.boundMarkers(_this.map.markers.start, _this.map.markers.end);

          restfulServices.get('/map/direction', [travel.start.lat, travel.start.lng, travel.end.lat, travel.end.lng], function(err, res) {
            if (err)
              return;

            _this.map.paths.direction = {
              color: 'red',
              weight: 5,
              latlngs: res.data.points,
              message: '<p>Distance: ' + res.data.distance + ' - Duration: ' + res.data.duration + '</p>'
            };
          });

        });

      }

    })();


  });
