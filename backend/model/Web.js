const {Schema, model} = require('mongoose');

const webSchema = new Schema({
    webName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    userName: {
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
    }
});

module.exports = model("webModal", webSchema);