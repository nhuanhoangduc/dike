var mongoose = require('../configs/database');
var Schema = mongoose.Schema;
var eventInterface = require('./eventInterface');

var travels = {

  typeOfUser: {
    type: String,
    enum: ['customer', 'driver']
  },

  start: {
    lat: Number,
    lng: Number
  },

  end: {
    lat: Number,
    lng: Number
  },

  vehicle: { type: String, enum: ['Car', 'Motorbike', 'Bicycle', 'Bus', 'Walk'] },

  freeSeats: {
    type: Number,
    default: 1,
    require: true
  },

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
