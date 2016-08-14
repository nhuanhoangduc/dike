app
  .controller('userController', function(UserServices, restfulServices, toastr, mapServices, moment, $stateParams) {
    var _this = this;
    this.moment = moment;

    this.user = UserServices.user;
    this.menu = $stateParams.menu || 'profile';

    this.events = {
      travel: {},
      study: {}
    };

    this.totalEvent = 0;
    this.totalEventJoin = 0;
    this.totalEventFavorite = 0;

    this.currentEvent = $stateParams.type || 'travel';


    this.updateUser = function() {

      restfulServices.put('/users', this.user, function(err, res) {

        UserServices.getCurrentUser(function() {});

        if (err)
          return toastr.error(err.data.message, 'Error');

        toastr.success('User has updated', 'Success');

      });

    };


    this.loadEvent = function(eventType, event) {

      restfulServices.get('/event/' + eventType + '/getbyuser', [], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        event.list = res.data;

      });

      restfulServices.get('/event/' + eventType + '/getbyusercount', [], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        event.count = res.data;
        _this.totalEvent += event.count;

      });

    };


    this.loadJoinEvents = function(eventType, event) {

      restfulServices.get('/event/' + eventType + '/join/getbyuser', [], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        event.joins = res.data;

      });

      restfulServices.get('/event/' + eventType + '/join/getbyusercount', [], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        event.joinCount = res.data;
        _this.totalEventJoin += event.joinCount;

      });

    };


    this.loadFavoriteEvents = function(eventType, event) {

      restfulServices.get('/event/' + eventType + '/favorite/getbyuser', [], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        event.favorites = res.data;

      });

      restfulServices.get('/event/' + eventType + '/favorite/getbyusercount', [], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        event.favoriteCount = res.data;
        _this.totalEventFavorite += event.favoriteCount;

      });

    };


    this.loadEvents = function() {

      this.totalEvent = 0;
      this.totalEventJoin = 0;
      this.totalEventFavorite = 0;

      for (event in _this.events) {
        _this.loadEvent(event, _this.events[event]);
        _this.loadJoinEvents(event, _this.events[event]);
        _this.loadFavoriteEvents(event, _this.events[event]);
      }

    };



    /* convert lat lng to place  */
    this.getGeoCode = function(start, end) {
      if (!start || !end)
        return;

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


    this.isFinish = function(finishTime) {
      var now = _this.moment();
      finishTime = _this.moment(finishTime);

      return (now > finishTime);
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


    // join an event
    this.join = function(eventId) {

      restfulServices.get('/post/join', [_this.currentEvent, eventId], function(err, res) {
        if (err)
          return toastr.error(err.data.message, 'Error');

        toastr.success('Success');
        _this.loadEvents();

      });

    };


    // favorite an event
    this.favorite = function(eventId) {

      restfulServices.get('/post/favorite', [_this.currentEvent, eventId], function(err, res) {
        if (err)
          return toastr.error(err.data.message, 'Error');

        toastr.info('Removed from your favorites', 'Success');
        _this.loadEvents();

      });

    };


    // init
    (function() {

      // update user
      UserServices.getCurrentUser(function() {});

      _this.loadEvents();
      _this.loadComments();

    })();


  });
