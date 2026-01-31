const { Schema, model } = require('mongoose');

const imgSchema = new Schema({
    imageUrl: { type: String, default: null }, // Full Cloudinary HTTPS link
    imagePublicId: { type: String, default: null }, // Required for deleting from Cloudinary
    name: { type: String, required: true },
    desc: { type: String },
    uniqueId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model("imgSchema", imgSchema);