app
  .controller('postController', function($stateParams, $state, postServices, UserServices, restfulServices, toastr, mapServices, moment) {
    var _this = this;
    this.type = $stateParams.type;
    this.eventId = $stateParams.eventId;
    this.post = {};
    this.user = UserServices.user;
    this.comments = [];
    this.moment = moment;
    this.isJoin = false;


    /* convert lat lng to place  */
    this.getGeoCode = function(start, end) {
      _this.post.startPlace = '';
      _this.post.endPlace = '';

      mapServices.geoCode(start.lat, start.lng, function(err, response) {
        _this.post.startPlace = response.data;
      });

      mapServices.geoCode(end.lat, end.lng, function(err, response) {
        _this.post.endPlace = response.data;
      });
    };


    // parse date data to string that people can easy to read information
    this.getFormatedDate = function(date) {
      return _this.moment(date).format('HH:mm, DD-MM-YYYY');
    };


    /* load all comments for this post */
    this.loadComments = function() {
      postServices.getComments(_this.type, _this.eventId, function(err, response) {
        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.comments = response.data;
      });
    };


    // load join comment
    this.loadJoinComments = function() {

      restfulServices.get('/comments/join', [_this.type, _this.eventId, ], function(err, res) {

        if (err)
          return toastr.error(err.message, 'Error');

        _this.comments = res.data;

      });

    };


    /* create new comment */
    this.postComment = function() {
      postServices.postComment(
        this.type,
        this.post,
        this.user,
        this.comment,
        this.isJoin,
        function(err, response) {
          if (err)
            return toastr.error(err.data.message, 'Error');

          toastr.success('You has posted a new comment', 'Success');
          _this.comment = '';

          // init comments
          if (_this.isJoin)
            _this.loadJoinComments();
          else
            _this.loadComments();

        });
    };


    // delete comment
    this.deleteComment = function(id) {
      if (confirm('Are you sure you want to delete this comment?')) {

        restfulServices.delete('/comments', [id], function(err, res) {
          if (err)
            return toastr.error(err.data.message, 'Error');

          toastr.success('You has deleted your comment', 'Success');
          _this.loadComments();
        });

      }
    };


    // join an event
    this.join = function() {

      if (this.user._id === this.post.user._id)
        return;

      restfulServices.get('/post/join', [_this.type, _this.post._id], function(err, res) {
        if (err)
          return toastr.error(err.message, 'Error');

        toastr.success('You has joint this event', 'Success');
        _this.getEvent();

      });

    };


    // delete event
    this.deleteEvent = function() {
      if (confirm('Are you sure you want to delete this event?')) {

        restfulServices.delete('/post', [_this.type, _this.post._id], function(err, res) {
          if (err)
            return toastr.error(err.data.message, 'Error');

          toastr.success('You has deleted your event', 'Success');
          $state.go('gowithme_search');
        });

      }
    };


    this.getEvent = function() {
      postServices.getEvent(_this.type, _this.eventId, function(err, response) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.post = response.data;

        if (_this.type === 'travel') {
          _this.getGeoCode(_this.post.start, _this.post.end);
        }

        // init comments
        if (_this.isJoin)
          _this.loadJoinComments();
        else
          _this.loadComments();

      });
    };


    this.changeComment = function(isJoin) {

      this.isJoin = isJoin;

      if (isJoin)
        _this.loadJoinComments();
      else
        _this.loadComments();

    };


    /* init funtion */
    (function() {

      // update user
      UserServices.getCurrentUser(function() {});

      // get event with type and event id params
      _this.getEvent();

    })();

  });
