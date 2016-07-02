app
  .factory('UserServices', function(restfulServices) {

    var services = {

      // update object
      updateUser: function(newUser) {

        for (var key in services.user)
          delete services.user[key];

        for (var newKey in newUser)
          services.user[newKey] = newUser[newKey];

      },

      // request to server to get current session
      getCurrentUser: function(done) {
        restfulServices.get('/users/currentUser', [], function(err, response) {
          if (err)
            return;

          services.updateUser(response.data);
        });
      },


      // store value of current user
      user: {}

    };


    return services;
  });
