const { body } = require('express-validator');

const add = [
    body('category_name').notEmpty().withMessage('category_name tidak boleh kosong')
]

module.exports = {
    add
}