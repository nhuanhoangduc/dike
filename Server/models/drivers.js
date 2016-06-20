var mongoose = require('../configs/database');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users' },
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
  typeOfMean: { type: String, enum: ['car', 'motorbike', 'bicycle', 'bus', 'walk'] },
  freeSeats: Number,
  startTime: Date,
  cost: Number,
  note: String
});

module.exports = mongoose.model('drivers', userSchema);
