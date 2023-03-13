const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler')
const validateMongoId = require('../utils/validateMongoID');
const convertToSlug = require('../utils/convertToSlug');
//  Create product
const createProduct = asyncHandler(async (req, res) => {
    try {
        const { title, description, price, quantity, color } = req.body
        const newProduct = await Product.create({
            title,
            description,
            price,
            quantity,
            color
        });
        res.json(newProduct)
    } catch (err) {
        throw new Error(err)
    }
})
//  All product
const allProducts = asyncHandler(async (req, res) => {

    // try {
        //  Filtering
        const queryObj = { ...req.query }
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

        const executeField = ["page", "sort", 'limit', 'field']
        executeField.forEach((el) => delete queryObj[el])


        let query = await Product.find()




        //  Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(' ');
            query = query.sort('price')

        } else {
            query = query.sort('-createdAt')
        }


        const products = await query;
        res.json(products)
    // } catch (err) {
    //     throw new Error(err)
    // }
})

//  get one product
const getOneProduct = asyncHandler(async function (req, res) {

    validateMongoId(req.params.id)
    try {
        const prodduct = await Product.findById(req.params.id);
        res.status(200).json(prodduct)

    } catch {
        throw new Error('This Product Not Found')
    }
});

//  delete product
const deleteproduct = asyncHandler(async function (req, res) {
    validateMongoId(req.params.id)
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedProduct)
    } catch {
        throw new Error('This product Not Found')
    }
})

//  update product
const updateProduct = asyncHandler(async function (req, res) {
    validateMongoId(req?.params?.id)
    try {
        const slug = await convertToSlug(req.body?.title);

        const updateProduct = await Product.findByIdAndUpdate(req.params?.id, {
            title: req?.body?.title,
            description: req?.body?.description,
            slug,
            price: req?.body?.price,
            quantity: req?.body?.quantity,
            color: req?.body?.color,
        }, {
            new: true
        });

        res.status(200).json(updateProduct)
    } catch {
        throw new Error('This product Not Found')
    }
})



module.exports = {
    createProduct,
    allProducts,
    getOneProduct,
    deleteproduct,
    updateProduct
}


