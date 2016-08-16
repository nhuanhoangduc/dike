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

  status: {
    type: String,
    enum: ['available', 'blocked'],
    default: 'available'
  },

  created: Date,

  lastLogin: Date

});

userSchema.index({ name: 'text' });
userSchema.index({ facebookId: 1 });
userSchema.index({ status: 1 });
userSchema.index({ created: 1 });
userSchema.index({ lastLogin: 1 });

module.exports = mongoose.model('users', userSchema);
