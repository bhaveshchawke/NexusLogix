const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
  vehicleId: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, required: true, enum: ['Bike', 'Van', 'Truck'] },
  model: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'On-trip', 'Maintenance'],
    default: 'Available'
  },
  assignedDriver: {
    type: Schema.Types.ObjectId,
    ref: 'Driver'
  },
  hostId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);