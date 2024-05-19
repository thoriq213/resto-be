const { body } = require('express-validator');
const userModel = require('../model/userModel');

const login = [
    body('username').trim().notEmpty().withMessage('username tidak boleh kosong'),
    body('password').trim().notEmpty().withMessage('role_id tidak boleh kosong')
];

const login_guest = [
    body('name').trim().notEmpty().withMessage('name tidak boleh kosong'),
    body('phone').trim().notEmpty().withMessage('phone tidak boleh kosong'),
    body('table_no').trim().notEmpty().withMessage('table_no tidak boleh kosong').isAlphanumeric().withMessage('table_no harus alpha numeric'),
];

module.exports = {
    login,
    login_guest
}