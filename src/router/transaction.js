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
    const getTranscation = await transactionModel.getTransactionByInvoice(body);
    res.status(getTranscation.code).json(getTranscation.body);
});

router.post('/update-transaction', transactionValidaton.update, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: false,
            msg: errors.array(),
            data: null
        });
    }

    const body = req.body;
    const updateTranscation = await transactionModel.editProduct(body);
    res.status(updateTranscation.code).json(updateTranscation.body);
});

router.post('/void', transactionValidaton.void_trans, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: false,
            msg: errors.array(),
            data: null
        });
    }

    const body = req.body;
    const voidTransaction = await transactionModel.voidTransaction(body);
    res.status(voidTransaction.code).json(voidTransaction.body);
});

router.post('/list', async (req, res) => {
    const body = req.body;
    const list = await transactionModel.listTransaction(body);
    res.status(list.code).json(list.body);
});

router.post('/finish_cook', transactionValidaton.finish_cook, async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: false,
            msg: errors.array(),
            data: null
        });
    }

    const body = req.body;
    const updateStatus = await transactionModel.finishCook(body);
    res.status(updateStatus.code).json(updateStatus.body);
});

router.post('/paid', transactionValidaton.finish_cook, async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: false,
            msg: errors.array(),
            data: null
        });
    }

    const body = req.body;
    const updateStatus = await transactionModel.paid(body);
    res.status(updateStatus.code).json(updateStatus.body);
});

module.exports = router