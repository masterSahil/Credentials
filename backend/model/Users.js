const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    userName: {
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
    uniqueId: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = model('Users', UserSchema);