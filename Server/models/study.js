var mongoose = require('../configs/database');
var Schema = mongoose.Schema;
var eventInterface = require('./eventInterface');


var schema = eventInterface({
  title: {
    type: String,
    default: 'Untitled'
  }
});
var studySchema = new Schema(schema);

module.exports = mongoose.model('studies', studySchema);
