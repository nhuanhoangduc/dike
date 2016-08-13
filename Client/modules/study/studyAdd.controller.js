app
  .controller('StudyAddCtrl', function(restfulServices, $state, toastr, moment) {

    var _this = this;

    this.request = {};
    this.request.finishTime = new Date();

    this.dateFormat = 'dd-MM-yyyy';
    // user input
    this.altInputFormats = ['dd-MM-yyyy'];

    this.submit = function() {
      _this.request.finishTime = moment(_this.request.finishTime);
      _this.request.finishTime.minute(59);
      _this.request.finishTime.hour(23);

      restfulServices.post('/event/study', _this.request, function(err, response) {
        if (err)
          return toastr.error(err.data.message ? err.data.message : err.data, 'Error');

        toastr.success('Event has added', 'Success!');
        $state.go('post', { type: 'study', eventId: response.data._id }, { reload: true });

      });
    };

  });
