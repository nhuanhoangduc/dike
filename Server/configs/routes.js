/*
 * Author: Hoang Duc Nhuan
 */

var routes = require('../routes/index');
var users = require('../routes/users');
var map = require('../routes/map');

module.exports = function(app) {
  app.use('/', routes);
  app.use('/users', users);
  app.use('/map', map);
};
