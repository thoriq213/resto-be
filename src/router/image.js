const express = require('express');
const router = express.Router();
const fs = require('fs').promises;

router.get('/:fileName', async(req, res) => {
    try {
      const imageName = req.params.fileName;
      const imagePath = `uploads/${imageName}`;
  
      const image = await fs.readFile(imagePath);
      res.writeHead(200, { 'Content-Type': 'image/jpg' });
      res.end(image, 'binary');
    } catch (error) {
      console.error('Error sending image:', error);
      res.status(500).send('Internal Server Error');
    }
  })
  
  
  module.exports = router