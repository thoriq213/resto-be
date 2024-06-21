require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const category = require('./src/router/category')
const product = require('./src/router/product')
const transaction = require('./src/router/transaction')
const user = require('./src/router/user')
const auth = require('./src/router/auth')
const image = require('./src/router/image')
const cors = require('cors')

app.use(cors());
app.use(bodyParser.json())

app.use('/category', category);
app.use('/product', product);
app.use('/transaction', transaction);
app.use('/user', user);
app.use('/auth', auth);
app.use('/image', image);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});