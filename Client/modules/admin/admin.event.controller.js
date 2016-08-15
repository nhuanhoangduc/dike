app
  .controller('AdminEventCtrl', function(restfulServices, toastr, moment) {

    var _this = this;

    this.type = 'travel';
    this.action = 'available';
    this.events = [];
    this.moment = moment;
    this.types = ['travel', 'study'];
    this.users = [];
    this.user = {};
    this.from = new Date();
    this.to = new Date();
    this.allTime = true;


    this.userComplete = function(name) {

      restfulServices.get('/admin/users/autocomplete', [name], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.users = res.data;

      });

    };

    this.loadEvents = function() {

      var request = {};

      if (_this.action === 'available') {

        request = {
          query: { status: 'available' },
          sort: { created: -1 },
          populate: 'user'
        };

      } else if (_this.action === 'blocked') {

        request = {
          query: { status: 'blocked' },
          sort: { created: -1 },
          populate: 'user'
        };

      } else {

        request = {
          query: { 'reports.0': { '$exists': true } },
          sort: { reports: -1 },
          populate: 'user reports'
        };

      }

      if (this.user._id)
        request.query.user = this.user._id;

      if (!this.allTime) {

        var startTime = moment(_this.from);
        startTime.minute(0);
        startTime.hour(0);

        var endTime = moment(_this.to);
        endTime.minute(59);
        endTime.hour(23);

        request.query.$and = [{
          finishTime: {
            $gte: startTime
          }
        }, {
          finishTime: {
            $lte: endTime
          }
        }];

      }

      restfulServices.post('/admin/events/' + _this.type, request, function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.events = res.data;

      });


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
