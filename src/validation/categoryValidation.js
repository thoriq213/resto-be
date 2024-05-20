const { body } = require('express-validator');

const add = [
    body('category_name').trim().notEmpty().withMessage('category_name tidak boleh kosong')
]

const update = [
    body('category_id').trim().notEmpty().withMessage('category_id tidak boleh kosong'),
    body('category_name').trim().notEmpty().withMessage('category_name tidak boleh kosong')
]

const detail = [
    body('category_id').trim().notEmpty().withMessage('category_id tidak boleh kosong')
]

const deleteData = [
    body('category_id').trim().notEmpty().withMessage('category_id tidak boleh kosong')
]

module.exports = {
    add,
    update,
    detail,
    deleteData
}