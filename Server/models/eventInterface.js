var mongoose = require('../configs/database');
var Schema = mongoose.Schema;


var eventSchema = {

  user: { type: Schema.Types.ObjectId, ref: 'users' }, // not in view

  join: [{ type: Schema.Types.ObjectId, ref: 'users' }], // not in view

  created: Date, // not in view

  note: String,

  commentUsers: [], // not in view

  reports: [{ type: Schema.Types.ObjectId, ref: 'users' }], // not in view

  favorites: [], // not in view

  status: {
    type: String,
    default: 'available',
    enum: ['available', 'closed', 'blocked']
  }, // not in view

  finishTime: {
    type: Date,
    require: true
  },

};


var merge = function(object) {

  var schema = eventSchema;

  for (var key in object) {
    schema[key] = object[key];
  }

  return schema;

};

module.exports = function(object) {
  return merge(object);
};
