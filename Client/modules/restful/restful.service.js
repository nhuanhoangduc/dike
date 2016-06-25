app.service('restfulServices', function($http) {

  var services = {

    get: function(url, params, callback) {

      for (var i = 0; i < params.length; i++) {
        url += '/' + params[i];
      }

      $http.get(url).then(function success(response) {
        return callback(null, response);
      }, function err(response) {
        return callback(response, null);
      });

    },

    post: function(url, params, callback) {

      $http.post(url, params).then(function success(response) {
        return callback(null, response);
      }, function err(response) {
        return callback(response, null);
      });

    },

    put: function(url, params, callback) {

      $http.put(url, params).then(function success(response) {
        return callback(null, response);
      }, function err(response) {
        return callback(response, null);
      });

    },

    delete: function(url, params, callback) {

      for (var param in params) {
        url += '/' + params;
      }

      $http.delete(url).then(function success(response) {
        return callback(null, response);
      }, function err(response) {
        return callback(response, null);
      });

    },

  };

  return services;
});
