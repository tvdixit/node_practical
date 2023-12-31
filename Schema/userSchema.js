const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    created_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    token: {
        type: String,
    },
});

module.exports = mongoose.model('User', UserSchema)
