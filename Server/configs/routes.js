/*
 * Author: Hoang Duc Nhuan
 */

var routes = require('../routes/index');
var users = require('../routes/users');
var map = require('../routes/map');
var travel = require('../routes/travel');
var facebook = require('../routes/facebook');
var post = require('../routes/post');
var comment = require('../routes/comment');

module.exports = function(app) {
  app.use('/', routes);
  app.use('/users', users);
  app.use('/map', map);
  app.use('/travel', travel);
  app.use('/facebook', facebook);
  app.use('/post', post);
  app.use('/comments', comment);
};
