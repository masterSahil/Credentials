const imgSchema = require('../model/img');
const path = require('path');
const fs = require('fs');

const getImgData = async (req, res) => {
    try {
        const data = await imgSchema.find();

        res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const createImgData = async (req, res) => {
    try {
        const {name, uniqueId, desc} = req.body;

        const data = new imgSchema(req.file ? {image: req.file.filename, name, uniqueId, desc} : {name, uniqueId, desc} );

        await data.save();

        res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const updateImgData = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, image, uniqueId, desc} = req.body;

        const data = await imgSchema.findByIdAndUpdate(id, {name, image, uniqueId, desc}, {new: true});

        res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const updateImg = async (req, res) => {
    try {
        const {id} = req.params;
        const updateImage = await imgSchema.findById(id);

        if (updateImage.image) {
            const file_path = path.join(__dirname, '../uploads/', updateImage.image);
            if (fs.existsSync(file_path)) {
                fs.unlinkSync(file_path);
            }
        }

        updateImage.image = req.file.filename;
        await updateImage.save();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const deleteImgData = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await imgSchema.findByIdAndDelete(id);

        if (data.image) {
            const file_path = path.join(__dirname, '../uploads/', data.image);
            if (fs.existsSync(file_path)) {
                fs.unlinkSync(file_path);
            }
        }

        res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const deleteImage = async (req, res) => {
    try {
        const {id} = req.params;
        const data2 = await imgSchema.findById(id);

        if (data2.image) {
            const file_path = path.join(__dirname, '../uploads/', data2.image);
            if (fs.existsSync(file_path)) {
                fs.unlinkSync(file_path);
            }
        }

        data2.image = null;
        await data2.save();

        res.status(200).json({
            success: true,
            data: data2,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const downloadImage = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await imgSchema.findById(id);

        if (!data || !data.image) {
            return res.status(404).json({ success: false, message: "File not found" });
        }

        const filePath = path.join(__dirname, '../uploads', data.image);

        if (fs.existsSync(filePath)) {
            return res.download(filePath); // ✅ This forces file download
        } else {
            return res.status(404).json({ success: false, message: "File not found on disk" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const checkImageExists = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await imgSchema.findById(id);

        if (!data || !data.image) {
            return res.status(200).json({ exists: false });
        }

        const filePath = path.join(__dirname, '../uploads', data.image);
        const exists = fs.existsSync(filePath);

        return res.status(200).json({ exists });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {getImgData, createImgData, updateImg, updateImgData, deleteImage, deleteImgData, downloadImage, checkImageExists};