const express = require('express');
const router = express.Router();
const { uploadPhoto, deletePhoto } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, admin, upload.single('photo'), uploadPhoto);
router.delete('/:filename', protect, admin, deletePhoto);

module.exports = router;

