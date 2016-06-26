var mongoose = require('../configs/database');
var Schema = mongoose.Schema;

var goWithMeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users' },

  created: Date,

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

  vehicle: { type: String, enum: ['car', 'motorbike', 'bicycle', 'bus', 'walk'] },

  freeSeats: {
    type: Number,
    default: 1,
    require: true
  },

  startTime: {
    type: Date,
    require: true
  },

  cost: {
    type: Number,
    require: true
  },

  note: String
});

goWithMeSchema.index({ start: '2d' });
goWithMeSchema.index({ end: '2d' });

module.exports = mongoose.model('gowithmes', goWithMeSchema);
