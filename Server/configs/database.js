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

// connect to database
mongoose.connect(dbUrl);
console.log('dbUrl: ' + dbUrl);

module.exports = mongoose;
