const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = Schema(
    {
        email: {
         type: String,
        required: true
    },
    password: 
    {
    type: String,
    required: true
    },
    confirmPassword: {
        type: String,
        required: true  
    },
    role: {
        type: String,
        enum: ['seller', 'buyer', 'investor'], 
        required: true,
    },
    })

    module.exports = mongoose.model('User', userSchema);