var mongoose = require('../configs/database');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users' },

  eventId: String,

  type: String,

  join: Boolean,

  created: Date,

  comment: String
});

commentSchema.index({ eventId: 1, type: 1, join: 1, created: 1 });


module.exports = mongoose.model('comments', commentSchema);
