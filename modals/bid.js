const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice', // Reference to the Invoice model
    // required: true,
  },
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user model
    // required: true,
  },
  amount: {
    type: Number,
    // required: true,
  },
  status: {
    type: Number,
    // enum: ['placed', 'accepted', 'rejected'], // Possible statuses for the bid
    default: 3,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
