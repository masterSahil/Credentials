const imgSchema = require('../model/img');
const cloudinary = require("../database/cloud"); 

// FETCH ALL
exports.getImgData = async (req, res) => {
    try {
        const data = await imgSchema.find();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// CREATE
exports.createImgData = async (req, res) => {
    try {
        const { name, uniqueId, desc } = req.body;
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded." });

        const newData = new imgSchema({
            name,
            uniqueId,
            desc,
            imageUrl: req.file.path,
            imagePublicId: req.file.filename // Multer-storage-cloudinary uses .filename for public_id
        });

        await newData.save();
        res.status(201).json({ success: true, data: newData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE ACTUAL FILE (Replace Cloudinary asset)
exports.updateImg = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await imgSchema.findById(id);

        if (!record) return res.status(404).json({ success: false, message: "Media not found" });

        if (req.file) {
            // Delete old file from Cloudinary if it exists
            if (record.imagePublicId) {
                await cloudinary.uploader.destroy(record.imagePublicId);
            }
            // Update database with new Cloudinary info
            record.imageUrl = req.file.path;
            record.imagePublicId = req.file.filename;
            await record.save();
        }

        res.status(200).json({ success: true, data: record });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE METADATA (Name and Description)
exports.updateImgData = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, desc } = req.body;
        const updated = await imgSchema.findByIdAndUpdate(id, { name, desc }, { new: true });
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE ENTRY AND FILE
exports.deleteImgData = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await imgSchema.findByIdAndDelete(id);

        if (data?.imagePublicId) {
            // Resource type "auto" helps if it's a video
            await cloudinary.uploader.destroy(data.imagePublicId, { resource_type: 'image' });
            // If it might be a video, Cloudinary usually needs explicit resource_type: 'video'
            await cloudinary.uploader.destroy(data.imagePublicId, { resource_type: 'video' });
        }

        res.status(200).json({ success: true, message: "Deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// HELPERS
exports.downloadImage = async (req, res) => {
    try {
        const data = await imgSchema.findById(req.params.id);
        if (!data?.imageUrl) return res.status(404).send("File not found");
        res.redirect(data.imageUrl);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.checkImageExists = async (req, res) => {
    try {
        const data = await imgSchema.findById(req.params.id);
        res.status(200).json({ exists: !!data?.imageUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};