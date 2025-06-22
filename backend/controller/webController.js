const webSchema = require('../model/Web');

const getWeb = async (req, res) => {
    try {
        const web = await webSchema.find();

        res.status(200).json({
            success: true,
            user: web,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const createWeb = async (req, res) => {
    try {
        const {webName, userName, email, password, uniqueId} = req.body;
        const newWeb = new webSchema({webName, userName, email, password, uniqueId});

        await newWeb.save();

        res.status(200).json({
            success: true,
            users: newWeb,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const updateWeb = async (req, res) => {
    try {
        const {id} = req.params;
        const {webName, userName, email, password, uniqueId} = req.body;
        
        const updatedWeb = await webSchema.findByIdAndUpdate(id, {webName, userName, email, password, uniqueId}, {new: true});

        res.status(200).json({
            success: true,
            users: updatedWeb,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const deleteWeb = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedWeb = await webSchema.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            users: deletedWeb,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {getWeb, createWeb, updateWeb, deleteWeb};