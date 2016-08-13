app
  .controller('StudyListCtrl', function(restfulServices, toastr, GoWithMeServices) {

    var _this = this;

    this.studies = [];
    this.goWithMeServices = GoWithMeServices;

    this.loadEvent = function() {

      restfulServices.get('/event/study', [], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.studies = res.data;

      });

    };

    (function() {

      _this.loadEvent();

    })();

  });
