var mongoose = require('../configs/database');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users' },

  eventId: { type: Schema.Types.ObjectId },

  type: String,

  join: Boolean,

  created: Date,

  comment: String
});


module.exports = mongoose.model('comments', commentSchema);
