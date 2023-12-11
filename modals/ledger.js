const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ledgerSchema = Schema({
     wallet_id: {
         type: mongoose.Types.ObjectId,
        required: true
    },
    opening_balance: {
        type: Number,
       required: true
   },
   closing_balance: {
    type: Number,
   required: true
},
trx_amt: {
    type: Number,
   required: true,
   default: 0
},
trx_type: {
    type: String,
   required: true
},

})

module.exports = mongoose.model('Ledger', ledgerSchema);