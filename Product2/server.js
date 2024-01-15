var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyparser=require('body-parser');
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public','index.html'));
});

app.get('/ReqProduct', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','ReqProduct.html'));
});

app.get('/AddProduct', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','AddProduct.html'));
});

app.get('/GetAllProducts', async (req, res) => {
  try {
    const productsData = fs.readFileSync('product.json', 'utf8');
    const products = JSON.parse(productsData);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/ReqProduct', async (req, res) => {
  try {
    var requestData = req.body;
    
    const productsData = fs.readFileSync('product.json', 'utf8');
   
    var products = JSON.parse(productsData);

    var requestedProduct = products.find(product => product.id === requestData.productId);
    if (requestedProduct) {
      res.json({ message: 'Product requested successfully', product: requestedProduct });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/AddProduct', async (req, res) => {
  try {
    var newProduct = req.body;
    const productsData = fs.readFileSync('product.json', 'utf8');
    var products = JSON.parse(productsData);
    newProduct.id = products.length + 1;
    products.push(newProduct);
    fs.writeFileSync('product.json', JSON.stringify(products, null, 2), 'utf8');
    res.json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(9000, () => {
  console.log('Server is running');
});

