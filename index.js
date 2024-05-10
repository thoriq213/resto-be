require('dotenv').config();
const express = require('express');
const app = express();
const category = require('./src/router/category')
const product = require('./src/router/product')
const transaction = require('./src/router/transaction')

app.use(express.json());

app.use('/category', category);
app.use('/product', product);
app.use('/transaction', transaction);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});