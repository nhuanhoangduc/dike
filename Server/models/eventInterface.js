var mongoose = require('../configs/database');
var Schema = mongoose.Schema;


var eventSchema = {

  user: { type: Schema.Types.ObjectId, ref: 'users' },

  join: [{ type: Schema.Types.ObjectId, ref: 'users' }],

  created: Date,

  note: String,

  commentUsers: [],

  reports: [{ type: Schema.Types.ObjectId, ref: 'users' }],

  favorites: [],

  disable: {
    type: Boolean,
    default: false
  },

  closed: {
    type: Boolean,
    default: false
  },

  startTime: {
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
