app
  .controller('postController', function($stateParams, postServices, UserServices, toastr, mapServices, moment) {
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
        console.log(err);
        console.log(response);

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
          console.log(err);
          console.log(response);
          _this.loadComments();
        });
    };


    /* init funtion */
    (function() {

      // update user
      UserServices.getCurrentUser(function() {});

      // get event with type and event id params
      postServices.getEvent(_this.type, _this.eventId, function(err, response) {
        if (err)
          toastr.error('Check your connection', 'Error');

        _this.post = response.data;

        if (_this.type === 'travel') {
          _this.getGeoCode(_this.post.start, _this.post.end);
        }
      });

      // init comments
      _this.loadComments();

    })();

  });
