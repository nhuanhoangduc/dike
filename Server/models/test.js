var mongoose = require('../configs/database');
var Schema = mongoose.Schema;

var testSchema = new Schema({
  date: Date,
  content: String,
  note: String,
  number: Number
});

module.exports = mongoose.model('tests', testSchema);
