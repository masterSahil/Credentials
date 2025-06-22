const express = require('express');
const { getLink, createLink, updateLink, deleteLink } = require('../controller/linkController');
const router = express.Router();

router.get('/link', getLink);
router.post('/link', createLink);
router.put('/link/:id', updateLink);
router.delete('/link/:id', deleteLink);

module.exports = router;