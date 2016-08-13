app
  .controller('adminEventCtrl', function(restfulServices, toastr, moment) {

    var _this = this;

    this.type = 'travel';
    this.action = 'available';
    this.events = [];
    this.moment = moment;


    this.loadAvailableEvents = function() {

      restfulServices.get('/admin/events', [_this.type], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.events = res.data;

      });

    };


    this.loadBlockedEvents = function() {

      restfulServices.get('/admin/events/disable', [_this.type], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.events = res.data;

      });

    };


    this.loadReportedEvents = function() {

      restfulServices.get('/admin/events/report', [_this.type], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.events = res.data;

      });

    };


    this.loadEvents = function() {

      if (_this.action === 'available')
        _this.loadAvailableEvents();
      else if (_this.action === 'blocked')
        _this.loadBlockedEvents();
      else
        _this.loadReportedEvents();

    };


    this.blockEvent = function(id) {

      restfulServices.get('/admin/events/block', [_this.type, id], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        toastr.warning('Event has blocked', 'Success');
        _this.loadEvents();

      });

    };


    this.unBlockEvent = function(id) {

      restfulServices.get('/admin/events/unblock', [_this.type, id], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        toastr.success('Event has unblocked', 'Success');
        _this.loadEvents();

      });

    };


    // parse date data to string that people can easy to read information
    this.getFormatedDate = function(date) {
      return _this.moment(date).format('HH:mm, DD-MM-YYYY');
    };


    this.loadEvents();


  });
