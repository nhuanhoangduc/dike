app
  .controller('StudyListCtrl', function(restfulServices, toastr, GoWithMeServices) {

    var _this = this;

    this.studies = [];
    this.goWithMeServices = GoWithMeServices;
    this.query = {
      status: 'available',
      finishTime: {
        $gt: new Date()
      },
    };

    this.titleFilter = '';

    this.loadEvents = function() {

      _this.query.title = { $regex: this.titleFilter, $options: 'i' };

      restfulServices.post('/event/search/study', { query: _this.query }, function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.studies = res.data;

      });

    };

    (function() {

      _this.loadEvents();

    })();

  });
