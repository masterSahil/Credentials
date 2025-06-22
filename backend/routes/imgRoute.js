const express = require('express');
const { getImgData, createImgData, updateImgData, updateImg, deleteImgData, deleteImage, downloadImage, checkImageExists } = require('../controller/imgController');
const imgRouter = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => 
        cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({storage: storage});

imgRouter.get('/img', getImgData);
imgRouter.get('/download/:id', downloadImage);
imgRouter.get('/check/:id', checkImageExists);
imgRouter.post('/img', upload.single('image'), createImgData);
imgRouter.put('/img/:id', upload.single('image'), updateImgData);
imgRouter.put('/image/:id', upload.single('image'), updateImg);
imgRouter.delete('/img/:id', deleteImgData);
imgRouter.delete('/image/:id', deleteImage);

module.exports = imgRouter;