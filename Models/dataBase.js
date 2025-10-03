const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shipmentSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  contents: {
    type: String,
    required: true
  },

  // 🔹 Tracking-related fields
  shipmentId: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Dispatched", "In Transit", "Out for Delivery", "Delivered"],
    default: "Pending"
  },
  currentLocation: {
    type: String,
    default: "Warehouse"
  },
  estimatedDelivery: {
    type: Date,
    default: () => {
      let date = new Date();
      date.setDate(date.getDate() + 5); // 5 din baad default delivery
      return date;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updates: [
    {
      message: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('Shipment', shipmentSchema);
