app
  .controller('MenusCtrl', function(UserServices, restfulServices, toastr) {
    var _this = this;

    this.user = UserServices.user;
    this.current = 'home';

    UserServices.getCurrentUser();

    this.logout = function() {
      restfulServices.get('/users/logout', [], function(err, res) {
        if (err)
          toastr.error(err.data.message, 'Error');

        UserServices.getCurrentUser(function() {});
        toastr.success('User has logout', 'Success');
      });
    };

  });
