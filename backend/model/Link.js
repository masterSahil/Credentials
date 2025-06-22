const {Schema, model} = require('mongoose');

const linkSchema = new Schema({
    plateform: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    uniqueId: {
        type: String,
        required: true,
    },
});

module.exports = model("link_Model", linkSchema);