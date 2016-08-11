/*
 * Author: Hoang Duc Nhuan
 */

var routes = require('../routes/index');
var users = require('../routes/users');
var map = require('../routes/map');
var facebook = require('../routes/facebook');
var post = require('../routes/post');
var event = require('../routes/event');
var comment = require('../routes/comment');
var admin = require('../routes/admin');
var test = require('../routes/test');

module.exports = function(app) {

  app.use('/', routes);
  app.use('/users', users);
  app.use('/map', map);
  app.use('/facebook', facebook);
  app.use('/post', post);
  app.use('/comments', comment);
  app.use('/admin', admin);
  app.use('/test', test);
  app.use('/event', event);

};
