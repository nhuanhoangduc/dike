app
  .factory('UserServices', function(restfulServices) {

    var services = {

      updateUser: function(newUser) {

        for (var key in services.user)
          delete services.user[key];

        for (var newKey in newUser)
          services.user[newKey] = newUser[newKey];

      },

      getCurrentUser: function(done) {
        restfulServices.get('/users/currentUser', [], function(err, response) {
          if (err)
            return;

          services.updateUser(response.data);
        });
      },

      user: {}

    };


    return services;
  });