var mongoose = require('../configs/database');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
  facebookId: String
});

module.exports = mongoose.model('admins', adminSchema);
