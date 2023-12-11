const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const walletSchema = Schema({
     user_email: {
         type: String,
        required: true
    },
    wallet_balance: {
        type: Number,
       required: true,
       default: 0
   }

})

module.exports = mongoose.model('Wallet', walletSchema);