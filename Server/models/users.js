var mongoose = require('../configs/database');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  facebookId: String,
  googleId: String,
  name: String,
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  image: String,
  phone: String,
  location: String,
  accessToken: String,
  status: String,
  created: Date,
  disable: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('users', userSchema);
