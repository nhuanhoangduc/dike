/*
 * Author: Hoang Duc Nhuan
 */

var routes = require('../routes/index');
var users = require('../routes/users');
var map = require('../routes/map');
var goWithMe = require('../routes/gowithme');
var facebook = require('../routes/facebook');

module.exports = function(app) {
  app.use('/', routes);
  app.use('/users', users);
  app.use('/map', map);
  app.use('/goWithMe', goWithMe);
  app.use('/facebook', facebook);
};
