app
  .controller('userController', function(UserServices) {
    var _this = this;

    this.user = UserServices.user;

    // init
    (function() {

      // update user
      UserServices.getCurrentUser(function() {});

    })();


  });
