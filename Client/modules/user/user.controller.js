app
  .controller('userController', function(UserServices, restfulServices, toastr, mapServices, moment) {
    var _this = this;
    this.moment = moment;

    this.user = UserServices.user;
    this.menu = 'profile';

    this.travels = [];
    this.travelCount = 0;

    this.comments = [];
    this.commentCount = 0;

    this.updateUser = function() {
      restfulServices.put('/users', this.user, function(err, res) {
        UserServices.getCurrentUser(function() {});

        if (err)
          return toastr.error(err.data.message, 'Error');

        toastr.success('User has updated', 'Success');

      });
    };


    this.loadTravel = function() {
      restfulServices.get('/travel/getbyuser', [], function(err, res) {
        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.travels = res.data;
      });

      restfulServices.get('/travel/getbyusercount', [], function(err, res) {
        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.travelCount = res.data;
      });
    };


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


    // parse date data to string that people can easy to read information
    this.getFormatedDate = function(date) {
      return _this.moment(date).format('HH:mm, DD-MM-YYYY');
    };


    this.isFinish = function(startTime) {
      var now = _this.moment();
      var startTime = _this.moment(startTime);

      return (now > startTime);
    };


    this.loadComments = function() {
      restfulServices.get('/comments/getbyuser', [], function(err, res) {
        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.comments = res.data;
      });

      restfulServices.get('/comments/getbyusercount', [], function(err, res) {
        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.commentCount = res.data;
      });
    };


    // init
    (function() {

      // update user
      UserServices.getCurrentUser(function() {});

      _this.loadTravel();
      _this.loadComments();

    })();


  });
