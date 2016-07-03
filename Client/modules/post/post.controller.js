app
  .controller('postController', function($stateParams, postServices, UserServices) {
    var _this = this;
    this.type = $stateParams.type;
    this.eventId = $stateParams.eventId;
    this.event = {};
    this.user = UserServices.user;


    /* init funtion */
    (function() {

      // update user
      UserServices.getCurrentUser(function() {});

      // get event 
      postServices.getEvent(_this.type, _this.eventId, function(err, response) {
        _this.event = response.data;
      });


    })();

  });
