app
  .controller('MenusCtrl', function(UserServices) {
    var _this = this;

    this.user = UserServices.user;
    UserServices.getCurrentUser();
  });
