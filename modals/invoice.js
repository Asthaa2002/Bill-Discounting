const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true
    },
    invoiceAmount: {
        type: Number,
        required: true
    },
    buyerEmail: {
        type: String,
        required: true
    },
    investorEmail: {
        type: String,
        required: false
    },
    issueDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    buyNowPrice: {
        type: Number,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    seller_email: {
        type: String,
        required: true
    },
    productDetails: {
        type: String,
        required: true
    },
    // Define a field for the file upload (assuming you're using GridFS for file storage)
   imageUrl: {
        type: String,
        required:true
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'File' // You may need to define a separate 'File' model for file storage
    },
    status: {
        type: Number,
        default: 0, // Default to "saved" status
      },
});

// Create and export the 'Invoice' model using the 'invoiceSchema'
module.exports = mongoose.model('Invoice', invoiceSchema);
