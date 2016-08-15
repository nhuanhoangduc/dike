app
  .controller('StudyAddCtrl', function(restfulServices, $state, toastr, moment, $stateParams) {

    var _this = this;

    this.request = {};
    this.request.finishTime = new Date();
    this.request.startTime = new Date();
    this.request.endTime = new Date();
    this.id = $stateParams.id || null;


    this.dateFormat = 'dd-MM-yyyy';
    // user input
    this.altInputFormats = ['dd-MM-yyyy'];

    this.submit = function() {

      _this.request.finishTime = moment(_this.request.finishTime);
      _this.request.finishTime.minute(59);
      _this.request.finishTime.hour(23);

      if (_this.id) {

        restfulServices.put('/event/study', _this.request, function(err, response) {
          if (err)
            return toastr.error(err.data.message ? err.data.message : err.data, 'Error');

          toastr.success('Event has updated', 'Success!');
          $state.go('post', { type: 'study', eventId: _this.id }, { reload: true });

        });

      } else {

        restfulServices.post('/event/study', _this.request, function(err, response) {
          if (err)
            return toastr.error(err.data.message ? err.data.message : err.data, 'Error');

          toastr.success('Event has added', 'Success!');
          $state.go('post', { type: 'study', eventId: response.data._id }, { reload: true });

        });

      }

    };


    this.loadEvent = function() {

      restfulServices.get('/event/study', [_this.id], function(err, res) {
        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.request = res.data;
        _this.request.finishTime = new Date(_this.request.finishTime);
        _this.request.startTime = new Date(_this.request.startTime);
        _this.request.endTime = new Date(_this.request.endTime);

      });

    };


    (function() {

      if (_this.id)
        _this.loadEvent();

    })();

  });
