app
  .controller('GoWithMeCtrl', function(restfulServices, toastr, moment, $stateParams, mapServices) {
    var _this = this;

    this.travels = [];
    this.moment = moment;


    restfulServices.get('/travel/nearby', [$stateParams.startLat, $stateParams.startLng, $stateParams.endLat, $stateParams.endLng], function(err, res) {
      if (err)
        toastr.error(err.message, 'Error');

      _this.travels = res.data;
      console.log(res.data);
    });


    /* convert lat lng to place  */
    this.getGeoCode = function(start, end) {
      start.place = '';
      end.place = '';

      mapServices.geoCode(start.lat, start.lng, function(err, response) {
        start.place = response.data;
      });

      mapServices.geoCode(end.lat, end.lng, function(err, response) {
        end.place = response.data;
      });
    };

  });
