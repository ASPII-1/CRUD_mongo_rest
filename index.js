const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/groceryApp')
    .then(() => {
        console.log("Connected to the Mongo server");
    })
    .catch(err => {
        console.log('error is:-', err)
    })
const express = require('express')
const app = express();
const path = require('path');
const methodOverride = require('method-override');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
const Product = require('./models/product');

const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/product', async (req, res) => {
    let { category } = req.query;
    if (!category) {
        let found = await Product.find({});
        res.render('product/index', { found, category: 'All' });
    }
    else {
        let found = await Product.find({ category: category })
        res.render('product/index', { found, category });
    }

});

app.get('/product/new', (req, res) => {
    res.render('product/new');
});

app.post('/product', async (req, res) => {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.redirect('/product');
})

app.get('/product/:id', async (req, res) => {
    const { id } = req.params;
    const found = await Product.findById(id);
    res.render('product/show', { found });
})

app.get('/product/:id/edit', async (req, res) => {
    const { id } = req.params;
    const found = await Product.findById(id);
    res.render('product/update', { found, categories });
})
app.put('/product/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/product/${product.id}`);
})
app.delete('/product/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.redirect('/product');
})
app.listen('3000', function () {
    console.log('hii welcome to localhost:3000');
})