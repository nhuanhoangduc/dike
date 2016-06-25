var mongoose = require('../configs/database');
var Schema = mongoose.Schema;

var logSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  ip: String,
  action: String,
  url: String,
  date: Date
});

module.exports = mongoose.model('logs', logSchema);
