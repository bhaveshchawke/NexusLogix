const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driverSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  licenseNumber: { type: String, required: true, unique: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'On-trip', 'Offline'],
    default: 'Available'
  },
  assignedVehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  hostId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);