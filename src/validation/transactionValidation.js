const { body } = require('express-validator');

const add = [
    body('table_no').trim().notEmpty().withMessage('table_no tidak boleh kosong'),
    body('customer_name').trim().notEmpty().withMessage('customer_name tidak boleh kosong'),
    body('customer_phone').trim().notEmpty().withMessage('customer_phone tidak boleh kosong'),
    body('product_list').trim().notEmpty().withMessage('product_list tidak boleh kosong').isArray().withMessage('product_list harus array')
]

const detail = [
    body('transaction_id').trim().notEmpty().withMessage('transaction_id tidak boleh kosong')
]

module.exports = {
    add,
    detail
}