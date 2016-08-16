var mongoose = require('../configs/database');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
  facebookId: String
});

adminSchema.index({ facebookId: 1 });


module.exports = mongoose.model('admins', adminSchema);
