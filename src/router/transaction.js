const express = require('express');
const router = express.Router();
const productModel = require('../model/productModel');
const transactionModel = require('../model/transactionModel');
const transactionValidaton = require('../validation/transactionValidation');
const { validationResult, body } = require('express-validator');

router.get('/', (req, res) => {
    res.status(200).json({
        status : true,
        msg : 'halaman transaction',
        data : null
      });
});

router.post('/add-transaction', transactionValidaton.add, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: false,
            msg: errors.array(),
            data: null
        });
    }

    const body = req.body;
    const addTranscation = await transactionModel.addTransaction(body);
    res.status(addTranscation.code).json(addTranscation.body);
});

router.post('/detail', transactionValidaton.detail, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: false,
            msg: errors.array(),
            data: null
        });
    }

    const body = req.body;
    const getTranscation = await transactionModel.getTransaction(body);
    res.status(getTranscation.code).json(getTranscation.body);
})

module.exports = router