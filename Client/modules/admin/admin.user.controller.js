app
  .controller('AdminUserCtrl', function(restfulServices, toastr, moment) {

    var _this = this;

    this.action = 'available';
    this.moment = moment;

    this.user = {};
    this.users = [];

    this.adminUser = {};
    this.adminUsers = [];

    this.userSuggest = [];



    this.loadUsers = function() {

      var request = {};

      if (_this.action === 'available')
        request.query = { status: 'available' };
      else
        request.query = { status: 'blocked' };

      if (this.userFilter)
        request.query.$text = { $search: this.userFilter };

      request.sort = { created: 1 };

      request.populate = '';


      restfulServices.post('/admin/users', request, function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.users = res.data;

      });

    };


    this.loadAdminUsers = function() {

      restfulServices.get('/admin/users/loadadmin', [], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.adminUsers = res.data;

      });

    };


    this.blockUser = function(id) {

      restfulServices.get('/admin/users/block', [id], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        toastr.warning('User has blocked', 'Success');
        _this.loadUsers();

      });

    };


    this.unBlockUser = function(id) {

      restfulServices.get('/admin/users/unblock', [id], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        toastr.success('User has unblocked', 'Success');
        _this.loadUsers();

      });

    };


    // parse date data to string that people can easy to read information
    this.getFormatedDate = function(date) {
      return _this.moment(date).format('HH:mm, DD-MM-YYYY');
    };


    this.userAutoComplete = function(name) {

      restfulServices.get('/admin/users/autocomplete', [name], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.userSuggest = res.data;

      });

    };


    this.assignAdmin = function() {

      restfulServices.get('/admin/users/assignadmin', [_this.adminUser.facebookId], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.loadAdminUsers();
        toastr.success(_this.adminUser.name + ' has became admin', 'Success');

      });

    };


    this.unAssignAdmin = function(user) {

      restfulServices.get('/admin/users/unassignadmin', [user.facebookId], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.loadAdminUsers();
        toastr.success(user.name + ' has became normal user', 'Success');

      });

    };


    this.loadUsers();
    this.loadAdminUsers();


  });
