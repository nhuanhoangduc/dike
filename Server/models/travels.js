var mongoose = require('../configs/database');
var Schema = mongoose.Schema;
var eventInterface = require('./eventInterface');

var travels = {

  start: {
    lat: Number,
    lng: Number
  },

  end: {
    lat: Number,
    lng: Number
  },

  vehicle: { type: String, enum: ['Car', 'Motorbike', 'Bicycle', 'Bus', 'Walk'] },

  cost: {
    type: String,
    require: true
  }

}

var schema = eventInterface(travels);

var travelSchema = new Schema(schema);

travelSchema.index({ start: '2d' });
travelSchema.index({ end: '2d' });

module.exports = mongoose.model('travels', travelSchema);
