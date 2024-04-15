const express = require('express');
const router = express.Router();
const categoryModel = require('../model/categoryModel');
const catagoryValidaton = require('../validation/categoryValidation');
const { validationResult } = require('express-validator');

// Rute pertama (/)
router.get('/', (req, res) => {
  res.status(200).json({
    status : true,
    msg : 'halaman category',
    data : null
  });
});

// Rute kedua (/about)
router.get('/list', (req, res) => {
    res.status(200).json({
        status : true,
        msg : 'halaman list category',
        data : null
      });
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
    const insert = await categoryModel.addCategory(body);

    res.status(insert.code).json(insert.body);
})

module.exports = router