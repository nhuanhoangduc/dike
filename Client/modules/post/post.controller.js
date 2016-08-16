app
  .controller('postController', function($stateParams, $uibModal, $state, postServices, UserServices, restfulServices, toastr, mapServices, moment, mapServices, GoWithMeServices) {

    var _this = this;
    var socket = io('/');


    this.type = $stateParams.type;
    this.eventId = $stateParams.eventId;
    this.post = {};
    this.user = UserServices.user;
    this.comments = [];
    this.moment = moment;
    this.isJoin = false;
    this.map = mapServices;
    this.goWithMeServices = GoWithMeServices;


    this.openTripView = function() {

      var modalInstance = $uibModal.open({
        templateUrl: '/post/views/tripView.modal.html',
        controller: 'TripViewCtrl as ctrl',
        size: 'lg',
        resolve: {
          id: function() {
            return _this.post._id;
          }
        }
      });

    };


    this.update = function() {
      var type = this.type;

      if (type === 'travel')
        type = 'gowithme';

      $state.go(type + '_edit', { id: this.post._id });
    };


    this.loadComments = function() {

      var request = {

        query: {
          eventId: _this.eventId,
          type: _this.type,
          join: _this.isJoin
        }

      };

      restfulServices.post('/comments/getAll', request, function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

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
          _this.loadComments();

          socket.emit('comment', { type: _this.type, eventId: _this.eventId });

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
          socket.emit('comment', { type: _this.type, eventId: _this.eventId });

        });

      }
    };


    // join an event
    this.join = function() {

      if (this.user._id === this.post.user._id)
        return;

      if (this.post.status !== 'available' || this.post.isFinish)
        return;

      restfulServices.get('/post/join', [_this.type, _this.post._id], function(err, res) {
        if (err)
          return toastr.error(err.data.message, 'Error');

        toastr.success('Success');
        _this.getEvent();
        socket.emit('join', { type: _this.type, eventId: _this.eventId });

      });

    };

    // report an event
    this.report = function() {

      if (confirm('Are you sure you want to report this event?')) {

        restfulServices.get('/post/report', [_this.type, _this.post._id], function(err, res) {
          if (err)
            return toastr.error(err.data.message, 'Error');

          toastr.warning('You has reported this event', 'Success');
          _this.getEvent();

        });

      }

    };

    // close an event
    this.close = function() {

      if (confirm('Are you sure you want to close this event?')) {

        restfulServices.get('/post/close', [_this.type, _this.post._id], function(err, res) {
          if (err)
            return toastr.error(err.data.message, 'Error');

          toastr.warning('You has closed your event', 'Success');
          _this.getEvent();
          socket.emit('close', { type: _this.type, eventId: _this.eventId });

        });

      }

    };

    // favorite an event
    this.favorite = function() {

      restfulServices.get('/post/favorite', [_this.type, _this.post._id], function(err, res) {
        if (err)
          return toastr.error(err.data.message, 'Error');

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

          restfulServices.get('/map/direction', [_this.post.start.lat, _this.post.start.lng, _this.post.end.lat, _this.post.end.lng], function(err, res) {
            if (err)
              return;

            _this.post.info = 'Distance: ' + res.data.distance + ' - Duration: ' + res.data.duration;

          });

        }

        // init comments
        _this.loadComments();

      });

    };


    this.changeComment = function() {
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

      // config socket io event
      var commentEvent = 'comment/' + _this.type + '/' + _this.eventId;
      socket.on(commentEvent, function() {
        _this.changeComment();
      });

      var joinEvent = 'join/' + _this.type + '/' + _this.eventId;
      socket.on(joinEvent, function() {
        _this.getEvent();
      });

      var closeEvent = 'close/' + _this.type + '/' + _this.eventId;
      socket.on(closeEvent, function() {
        _this.getEvent();
      });

    })();

  });
