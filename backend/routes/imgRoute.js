const express = require('express');
const imgRouter = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../database/cloud");

const { 
    getImgData, 
    createImgData, 
    updateImg, 
    updateImgData, 
    deleteImgData 
} = require('../controller/imgController');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "users_vault",
      resource_type: "auto",
      // Keep filenames clean by removing extensions from the ID
      public_id: Date.now() + "-" + file.originalname.split('.')[0], 
    };
  },
});

const upload = multer({ storage });

// Routes
imgRouter.get('/img', getImgData);
imgRouter.post('/img', upload.single('image'), createImgData);
imgRouter.put('/img/:id', updateImgData); 
imgRouter.put('/image/:id', upload.single('image'), updateImg); 
imgRouter.delete('/img/:id', deleteImgData);

module.exports = imgRouter;