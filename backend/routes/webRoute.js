const express = require('express');
const router = express.Router();
const {getWeb, createWeb, deleteWeb, updateWeb} = require('../controller/webController')

router.get('/web', getWeb);
router.post('/web', createWeb);
router.put('/web/:id', updateWeb);
router.delete('/web/:id', deleteWeb);

module.exports = router;