app
  .controller('postController', function($stateParams, $state, postServices, UserServices, restfulServices, toastr, mapServices, moment, mapServices, GoWithMeServices) {
    var _this = this;
    this.type = $stateParams.type;
    this.eventId = $stateParams.eventId;
    this.post = {};
    this.user = UserServices.user;
    this.comments = [];
    this.moment = moment;
    this.isJoin = false;
    this.map = mapServices;
    this.goWithMeServices = GoWithMeServices;


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

          // init comments
          if (_this.isJoin)
            _this.loadJoinComments();
          else
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

    // report an event
    this.report = function() {

      if (confirm('Are you sure you want to report this event?')) {

        restfulServices.get('/post/report', [_this.type, _this.post._id], function(err, res) {
          if (err)
            return toastr.error(err.message, 'Error');

          toastr.warning('You has reported this event', 'Success');
          _this.getEvent();

        });

      }

    };

    // favorite an event
    this.favorite = function() {

      restfulServices.get('/post/favorite', [_this.type, _this.post._id], function(err, res) {
        if (err)
          return toastr.error(err.message, 'Error');

        if (_this.post.favorites.indexOf(_this.user._id) < 0)
          toastr.info('Added to your favorites', 'Success');
        else
          toastr.info('Removed from your favorites', 'Success');

        _this.getEvent();

      });

    };


    // delete event
    this.deleteEvent = function() {
      if (confirm('Are you sure you want to delete this event?')) {

        restfulServices.delete('/post', [_this.type, _this.post._id], function(err, res) {
          if (err)
            return toastr.error(err.data.message, 'Error');

          toastr.warning('You has deleted your event', 'Success');
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
          _this.goWithMeServices.getGeoCode(_this.map, _this.post.start, _this.post.end);
        }

        // init comments
        if (_this.isJoin)
          _this.loadJoinComments();
        else
          _this.loadComments();

      });
    };


    this.changeComment = function() {

      if (this.isJoin)
        _this.loadJoinComments();
      else
        _this.loadComments();

    };


    this.facebookShare = function() {

      var postUrl = 'http%3A%2F%2Fwww.fudiemhen.com%2F%23%2Fpost%2F' + this.type + '/' + this.eventId;
      var fbShareUrl = 'http://www.facebook.com/sharer.php?s=100&p[title]=GoWithMe&p[summary]=Go&p[url]=' + postUrl + '&p[images][0]=YOUR_IMAGE_TO_SHARE_OBJECT';

      window.open(fbShareUrl, 'newwindow', 'width=500, height=400');

    };


    /* init funtion */
    (function() {

      // update user
      UserServices.getCurrentUser(function() {});

      // get event with type and event id params
      _this.getEvent();

    })();

  });
