const { body } = require('express-validator');

const add = [
    body('product_name').trim().notEmpty().withMessage('product_name tidak boleh kosong'),
    body('category_id').trim().notEmpty().withMessage('category_id tidak boleh kosong'),
    body('price').trim().notEmpty().withMessage('price tidak boleh kosong')
]

const update = [
    body('product_id').trim().notEmpty().withMessage('product_id tidak boleh kosong'),
    body('product_name').trim().notEmpty().withMessage('product_name tidak boleh kosong'),
    body('category_id').trim().notEmpty().withMessage('category_id tidak boleh kosong'),
    body('price').trim().notEmpty().withMessage('price tidak boleh kosong')
]

const deleteData = [
    body('product_id').trim().notEmpty().withMessage('product_id tidak boleh kosong')
]

const detail = [
    body('product_id').trim().notEmpty().withMessage('product_id tidak boleh kosong')
]

module.exports = {
    add,
    update,
    deleteData,
    detail  
}