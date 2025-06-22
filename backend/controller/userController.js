const Users = require('../model/Users');

const getUsers = async (req, res) => {
    try {
        const users = await Users.find();

        res.status(200).json({
            success: true,
            user: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const postUsers = async (req, res) => {
    try {
        const {userName, email, password, uniqueId, phone, dob, gender} = req.body;
        const newUser = new Users({userName, email, password, uniqueId, phone, dob, gender});

        await newUser.save();

        res.status(200).json({
            success: true,
            users: newUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const updateUsers = async (req, res) => {
    try {
        const {id} = req.params;
        const {userName, email, password, uniqueId, phone, dob, gender} = req.body;
        
        const updatedUser = await Users.findByIdAndUpdate(id, {userName, email, password, uniqueId, phone, dob, gender}, {new: true});

        res.status(200).json({
            success: true,
            users: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const deleteUsers = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedUser = await Users.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            users: deletedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {getUsers, postUsers, updateUsers, deleteUsers};