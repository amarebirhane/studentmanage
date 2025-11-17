const path = require('path');
const fs = require('fs');

// @desc    Upload student photo
// @route   POST /api/v1/upload
// @access  Private/Admin
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return the file path relative to the public/uploads directory
    const filePath = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'File uploaded successfully',
      photo: filePath,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete photo
// @route   DELETE /api/v1/upload/:filename
// @access  Private/Admin
const deletePhoto = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadPhoto,
  deletePhoto,
};

