const express = require('express');
const router = express.Router();
const productModel = require('../model/productModel');
const categoryModel = require('../model/categoryModel');
const productValidation = require('../validation/productValidation');
const { validationResult, body } = require('express-validator');
const fs = require('fs').promises;

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Folder penyimpanan file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Nama file yang diunggah
  }
});

const upload = multer({ storage: storage });


// Rute pertama (/)
router.get('/', (req, res) => {
  res.status(200).json({
    status : true,
    msg : 'halaman product',
    data : null
  });
});

router.get('/list', async (req, res) => {
  const getProduct = await productModel.listProduct();
  res.status(getProduct.code).json(getProduct.body);
});

router.post('/add', upload.single('image'), productValidation.add, async (req, res) =>{
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ 
        status: false,
        msg: errors.array(),
        data: null
    });
  }
  const body = req.body;
  if(req.file){
    const {filename} = req.file;
    body.image = filename;
  } else {
    body.image = null;
  }

  const bodyCekCategory = {
    category_id : body.category_id
  }

  const cekCategory = await categoryModel.getCategory(bodyCekCategory);

  if(cekCategory.body.data == null){
    return res.status(400).json({ 
      status: false,
      msg: 'category_id tidak ditemukan',
      data: null
  });
  }

  const addProduct = await productModel.addProduct(body);
  res.status(addProduct.code).json(addProduct.body);
});

router.post('/update', upload.single('image'), productValidation.update, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ 
        status: false,
        msg: errors.array(),
        data: null
    });
  }

  const body = req.body;
  if(req.file){
    const {filename} = req.file;
    body.image = filename;
  } else {
    body.image = null;
  }

  const bodyCekCategory = {
    category_id : body.category_id
  }

  const cekCategory = await categoryModel.getCategory(bodyCekCategory);

  if(cekCategory.body.data == null){
    return res.status(400).json({ 
      status: false,
      msg: 'category_id tidak ditemukan',
      data: null
    });
  }

  const updateProduct = await productModel.updateProduct(body);

  res.status(updateProduct.code).json(updateProduct.body);
});

router.post('/delete', productValidation.deleteData, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ 
        status: false,
        msg: errors.array(),
        data: null
    });
  }

  const body = req.body;

  const deleteProduct = await productModel.deleteProduct(body);
  res.status(deleteProduct.code).json(deleteProduct.body);
});

router.post('/detail', productValidation.detail, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ 
        status: false,
        msg: errors.array(),
        data: null
    });
  }

  const body = req.body;

  const detailProduct = await productModel.getProduct(body);
  res.status(detailProduct.code).json(detailProduct.body);
});

router.get('/image/:fileName', async(req, res) => {
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