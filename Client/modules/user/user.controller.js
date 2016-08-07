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

    this.joinTravels = [];
    this.joinTravelCount = 0;

    this.favoriteTravels = [];
    this.favoriteTravelCount = 0;

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
      startTime = _this.moment(startTime);

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


    /* join travel */

    // load join travels and join travel count 
    this.loadJoinTravels = function() {

      restfulServices.get('/travel/join/getbyuser', [], function(err, res) {
        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.joinTravels = res.data;
      });

      restfulServices.get('/travel/join/getbyusercount', [], function(err, res) {
        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.joinTravelCount = res.data;
      });

    };


    this.loadFavoriteTravels = function() {

      restfulServices.get('/travel/favorite/getbyuser', [], function(err, res) {
        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.favoriteTravels = res.data;
      });

      restfulServices.get('/travel/favorite/getbyusercount', [], function(err, res) {
        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.favoriteTravelCount = res.data;
      });

    };

    /* end join travel */


    // init
    (function() {

      // update user
      UserServices.getCurrentUser(function() {});

      _this.loadTravel();
      _this.loadComments();
      _this.loadJoinTravels();
      _this.loadFavoriteTravels();

    })();


  });
