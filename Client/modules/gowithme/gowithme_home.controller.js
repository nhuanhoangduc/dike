app
  .controller('GoWithMeCtrl', function(restfulServices, mapServices, toastr, moment, $stateParams, mapServices, GoWithMeServices) {
    var _this = this;

    this.travels = [];
    this.services = GoWithMeServices;
    this.map = mapServices;


    restfulServices.get('/event/travel/nearby', [$stateParams.startLat, $stateParams.startLng, $stateParams.endLat, $stateParams.endLng, $stateParams.startRadius, $stateParams.endRadius], function(err, res) {
      if (err)
        toastr.error(err.data.message, 'Error');

      _this.travels = res.data;
      console.log(res.data);
    });

  });
