/*
 * Author Hoang Duc Nhuan
 */

var mongoose = require('mongoose');
var dbUrl = '';

// set database url
if (process.env.environment === 'development') {
  dbUrl = 'mongodb://localhost/dike-development';
} else { // production
  dbUrl = 'mongodb://localhost/dike';
}

// mlab 
dbUrl = 'mongodb://MeetingPointsAdmin:nhuan@ds034208.mlab.com:34208/nhuandb';

// connect to database
mongoose.connect(dbUrl);
console.log('dbUrl: ' + dbUrl);

module.exports = mongoose;
