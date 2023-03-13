const express = require('express');
const { createProduct, allProducts, getOneProduct, deleteproduct, updateProduct } = require('../controller/productController');
const auchCheck = require('../middlewares/authCheck');
const isAdmin = require('../middlewares/isAdmin');
const router = express.Router();

//  get all product
router.get('/all', auchCheck, isAdmin, allProducts)

//  get one product
router.get('/:id', auchCheck, isAdmin, getOneProduct)

//  create a product
router.post('/create', auchCheck, isAdmin, createProduct)

//  delete product
router.delete('/:id', auchCheck, isAdmin, deleteproduct)

//  update product
router.put('/:id', isAdmin, updateProduct)


module.exports = router;



