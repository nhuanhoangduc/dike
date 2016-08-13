app
  .controller('adminUserCtrl', function(restfulServices, toastr, moment) {

    var _this = this;

    this.action = 'available';
    this.users = [];
    this.moment = moment;


    this.loadAvailableUsers = function() {

      restfulServices.get('/admin/users', [], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.users = res.data;

      });

    };


    this.loadBlockedUsers = function() {

      restfulServices.get('/admin/users/block', [], function(err, res) {

        if (err)
          return toastr.error(err.data.message, 'Error');

        _this.users = res.data;

      });

    };


    this.loadUsers = function() {

      if (_this.action === 'available')
        _this.loadAvailableUsers();
      else
        _this.loadBlockedUsers();

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


    this.loadUsers();


  });
