app
  .controller('MenusCtrl', function(UserServices) {
    var _this = this;

    this.userServices = UserServices;
    this.userServices.getCurrentUser();
  });
