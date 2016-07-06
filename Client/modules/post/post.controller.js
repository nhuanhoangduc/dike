app
  .controller('postController', function($stateParams, postServices, UserServices, toastr) {
    var _this = this;
    this.type = $stateParams.type;
    this.eventId = $stateParams.eventId;
    this.post = {};
    this.user = UserServices.user;


    /* init funtion */
    (function() {

      // update user
      UserServices.getCurrentUser(function() {});

      // get event with type and event id params
      postServices.getEvent(_this.type, _this.eventId, function(err, response) {
        if (err)
          toastr.error('Check your connection', 'Error');

        _this.post = response.data;
      });


    })();

  });
