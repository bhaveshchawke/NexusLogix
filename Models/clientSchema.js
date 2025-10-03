const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String, // Use String for phone numbers to support characters like '+'
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['client', 'host'],
    default: 'client'
  },
});

module.exports = mongoose.model('Client', clientSchema);
