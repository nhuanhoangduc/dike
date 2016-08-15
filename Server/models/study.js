var mongoose = require('../configs/database');
var Schema = mongoose.Schema;
var eventInterface = require('./eventInterface');


var schema = eventInterface({

  title: {
    type: String,
    default: 'Untitled'
  },

  teacher: {
    type: String,
    default: 'Unknown'
  },

  duration: {
    type: String,
    default: 'Unknown'
  },

  startTime: {
    type: Date
  },

  endTime: {
    type: Date
  },

});

var studySchema = new Schema(schema);

module.exports = mongoose.model('studies', studySchema);
