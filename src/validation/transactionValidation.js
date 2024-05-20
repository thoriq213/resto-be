const { body } = require('express-validator');

const add = [
    body('product_list').notEmpty().withMessage('product_list tidak boleh kosong').isArray().withMessage('product_list harus array')
]

const update = [
    body('table_no').trim().notEmpty().withMessage('table_no tidak boleh kosong'),
    body('invoice_no').trim().notEmpty().withMessage('invoice_no tidak boleh kosong'),
    body('product_list').notEmpty().withMessage('product_list tidak boleh kosong').isArray().withMessage('product_list harus array')
]

const detail = [
    body('invoice_no').trim().notEmpty().withMessage('invoice_no tidak boleh kosong')
]

const void_trans = [
    body('invoice_no').trim().notEmpty().withMessage('invoice_no tidak boleh kosong')
]

const finish_cook = [
    body('invoice_no').trim().notEmpty().withMessage('invoice_no tidak boleh kosong')
]

const paid = [
    body('invoice_no').trim().notEmpty().withMessage('invoice_no tidak boleh kosong')
]

module.exports = {
    add,
    detail,
    update,
    void_trans,
    finish_cook,
    paid
}