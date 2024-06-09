const express = require('express');
const router = express.Router();
const userValidation = require('../validation/userValidation')
const userModel = require('../model/userModel')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
let dataSession = {};

router.use((req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({
      status : false,
      msg : 'access denied',
      data : null
    });
  }
  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    dataSession = verified;
    next();
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: 'session expired',
      is_regenerate_token: true
    });
  }
})

// Rute pertama (/)
router.get('/', (req, res) => {
  res.status(200).json({
    status : true,
    msg : 'halaman user',
    data : null
  });
});

router.post('/add', userValidation.add, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: false,
            msg: errors.array(),
            data: null
        });
    }

    const body = req.body;
    body.user_inp = dataSession.username;
    const cekRole = await userModel.getRole(body);
    if(cekRole.body.data == null) {
        return res.status(400).json({
            status: false,
            msg: 'role_id tidak ditemukan',
            data: null
        })
    }

    const addUser = await userModel.addUser(body);
    res.status(addUser.code).json(addUser.body);

});

router.get('/list', async (req, res) => {
    const getList = await userModel.listUser();
    res.status(getList.code).json(getList.body);
});

router.post('/delete', userValidation.deleteData, async (req, res) => {
    const body = req.body
    body.user_inp = dataSession.username;
    const deleteUser = await userModel.deleteUser(body);
    res.status(deleteUser.code).json(deleteUser.body);
})

module.exports = router