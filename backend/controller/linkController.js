const linkSchema = require('../model/Link');

const getLink = async (req, res) => {
    try {
        const getLinkData = await linkSchema.find();

        res.status(200).json({
            success: true,
            link: getLinkData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const createLink = async (req, res) => {
    try {
        const {plateform, link, uniqueId} = req.body;
        const createdLinkData = new linkSchema({plateform, link, uniqueId});

        await createdLinkData.save();

        res.status(200).json({
            success: true,
            link: createdLinkData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const updateLink = async (req, res) => {
    try {
        const {id} = req.params;
        const {plateform, link, uniqueId} = req.body;

        const updatedLinkData = await linkSchema.findByIdAndUpdate(id, {plateform, link, uniqueId}, {new: true});

        res.status(200).json({
            success: true,
            link: updatedLinkData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const deleteLink = async (req, res) => {
    try {
        const {id} = req.params;

        const deleteLinkData = await linkSchema.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            link: deleteLinkData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {getLink, createLink, updateLink, deleteLink};