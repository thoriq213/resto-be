const express = require('express');
const router = express.Router();
const authValidation = require('../validation/authValidation')
const userModel = require('../model/userModel')
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Rute pertama (/)
router.get('/', (req, res) => {
  res.status(200).json({
    status : true,
    msg : 'halaman user',
    data : null
  });
});

router.post('/login', authValidation.login, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: false,
            msg: errors.array(),
            data: null
        });
    }

    const body = req.body;
    const getData = await userModel.getUser(body);
    if(getData.body.data == null){
        return res.status(400).json({
            status : false,
            msg: 'username tidak ditemukan',
            data: null
        })
    }

    const userData = getData.body.data;

    const validPassword = await bcrypt.compare(body.password, userData.password);
    if(!validPassword){
        return res.status(400).json({
            status : false,
            msg: 'password dan username tidak sesuai',
            data: null
        })
    }
    const token = jwt.sign({username: userData.username, role_id: userData.role_id}, process.env.SECRET_KEY, {expiresIn: '1h'});
    res.status(200).json({token});
});

router.post('/login_guest', authValidation.login_guest, async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: false,
            msg: errors.array(),
            data: null
        });
    }
    
    const body = req.body;
    const token = jwt.sign({name: body.name, phone: body.phone, table_no: body.table_no}, process.env.SECRET_KEY, {expiresIn: '1h'});
    res.status(200).json({token});
});

module.exports = router