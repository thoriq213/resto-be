require('dotenv').config();
const express = require('express');
const app = express();
const category = require('./src/router/category')

app.use(express.json());

app.use('/category', category);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});