app
  .controller('GoWithMeCtrl', function(restfulServices, mapServices, toastr, moment, $stateParams, mapServices, GoWithMeServices) {
    var _this = this;

    this.travels = [];
    this.services = GoWithMeServices;
    this.map = mapServices;


    restfulServices.get('/travel/nearby', [$stateParams.startLat, $stateParams.startLng, $stateParams.endLat, $stateParams.endLng], function(err, res) {
      if (err)
        toastr.error(err.message, 'Error');

      _this.travels = res.data;
      console.log(res.data);
    });

  });
