const express = require('express');
const { getUsers, postUsers, updateUsers, deleteUsers } = require('../controller/userController');
const router = express.Router();

router.get('/users', getUsers);
router.post('/users', postUsers);
router.put('/users/:id', updateUsers);
router.delete('/users/:id', deleteUsers);

module.exports = router;