var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('../services/OAuth/passport');
var session = require('express-session');

var app = express();

// set environment
app.set('env', process.env.environment);


// config static file
if (app.get('env') === 'development') {
  app.use(express.static(path.join(__dirname, '../../Client/modules')));
}

app.use(express.static(path.join(__dirname, '../../Client/production')));
app.use(express.static(path.join(__dirname, '../../Client/libs')));
app.use(express.static(path.join(__dirname, '../../Client/public')));


// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.enable('trust proxy');


// session
app.use(session({
  secret: 'keyboard cat',
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// config routes
require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.send(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


module.exports = app;
