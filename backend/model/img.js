const {Schema, model} = require('mongoose');

const imgSchema = new Schema({
    image: {
        type: String,
        default: null,
    },
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    uniqueId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = model("imgSchema", imgSchema);