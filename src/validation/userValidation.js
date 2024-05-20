const { body } = require('express-validator');
const userModel = require('../model/userModel');

const add = [
    body('username').trim().notEmpty().withMessage('username tidak boleh kosong').custom(async value => {
        const body = {username : value}
        const getUser = await userModel.getUser(body)
        if(getUser.code == 200){
            throw new Error('username sudah digunakan')
        }
    }),
    body('role_id').trim().notEmpty().withMessage('role_id tidak boleh kosong').isNumeric().withMessage('role_id harus numeric')
];

const deleteData = [
    body('username').trim().notEmpty().withMessage('username tidak boleh kosong')
]

module.exports = {
    add,
    deleteData
}