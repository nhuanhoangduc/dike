app
  .controller('userController', function(UserServices, restfulServices, toastr) {
    var _this = this;

    this.user = UserServices.user;
    this.menu = 'profile';


    this.updateUser = function() {
      restfulServices.put('/users', this.user, function(err, res) {
        UserServices.getCurrentUser(function() {});

        if (err)
          return toastr.error(err.data.message, 'Error');

        toastr.success('User has updated', 'Success');

      });
    };

    // init
    (function() {

      // update user
      UserServices.getCurrentUser(function() {});

    })();


  });
