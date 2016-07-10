var mongoose = require('../configs/database');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  ownUser: { type: Schema.Types.ObjectId, ref: 'users' },

  user: { type: Schema.Types.ObjectId, ref: 'users' },

  eventId: { type: Schema.Types.ObjectId },

  type: String,

  created: Date,

  comment: String
});


module.exports = mongoose.model('travelcomments', commentSchema);