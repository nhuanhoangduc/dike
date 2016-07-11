app
  .controller('postController', function($stateParams, postServices, UserServices, restfulServices, toastr, mapServices, moment, toastr) {
    var _this = this;
    this.type = $stateParams.type;
    this.eventId = $stateParams.eventId;
    this.post = {};
    this.user = UserServices.user;
    this.comments = [];
    this.moment = moment;


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


    /* create new comment */
    this.postComment = function() {
      postServices.postComment(
        this.type,
        this.post,
        this.user,
        this.comment,
        function(err, response) {
          if (err)
            return toastr.error(err.data.message, 'Error');

          toastr.success('You has posted a new comment', 'Success');
          _this.comment = '';
          _this.loadComments();
        });
    };

    // delete comment
    this.deleteComment = function(id) {
      restfulServices.delete('/comments', [id], function(err, res) {
        if (err)
          return toastr.error(err.data.message, 'Error');

        toastr.success('You has deleted your comment', 'Success');
        _this.loadComments();
      });
    };


    /* init funtion */
    (function() {

      // update user
      UserServices.getCurrentUser(function() {});

      // get event with type and event id params
      postServices.getEvent(_this.type, _this.eventId, function(err, response) {
        console.log(err)
        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.post = response.data;

        if (_this.type === 'travel') {
          _this.getGeoCode(_this.post.start, _this.post.end);
        }

        // init comments
        _this.loadComments();

      });

    })();

  });
