const express = require('express');
const router = express.Router();
const categoryModel = require('../model/categoryModel');
const catagoryValidaton = require('../validation/categoryValidation');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
let dataSession = {};

router.use((req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({
      status : false,
      msg : 'access denied',
      data : null
    });
  }
  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    dataSession = verified;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
})

// Rute pertama (/)
router.get('/', (req, res) => {
  res.status(200).json({
    status : true,
    msg : 'halaman category',
    data : null
  });
});

// Rute kedua (/about)
router.get('/list', async(req, res) => {
  const getData = await categoryModel.listCategory();
  res.status(getData.code).json(getData.body);
});

router.post('/add', catagoryValidaton.add, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ 
          status: false,
          msg: errors.array(),
          data: null
      });
  }

  const body = req.body;
  body.user_inp = dataSession.username;
  const insert = await categoryModel.addCategory(body);
  
  res.status(insert.code).json(insert.body);
});

router.post('/update', catagoryValidaton.update, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(400).json({ 
          status: false,
          msg: errors.array(),
          data: null
      });
  }

  const body = req.body;
  body.user_inp = dataSession.username;
  const insert = await categoryModel.editCategory(body);

  res.status(insert.code).json(insert.body);
});

router.post('/detail', catagoryValidaton.detail, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(400).json({ 
          status: false,
          msg: errors.array(),
          data: null
      });
  }

  const body = req.body;
  const insert = await categoryModel.getCategory(body);

  res.status(insert.code).json(insert.body);
});

router.post('/delete', catagoryValidaton.deleteData, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(400).json({ 
          status: false,
          msg: errors.array(),
          data: null
      });
  }

  const body = req.body;
  const insert = await categoryModel.deleteCategory(body);

  res.status(insert.code).json(insert.body);
});

module.exports = router