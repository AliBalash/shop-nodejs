const mongoose = require('mongoose'); // Erase if already required
const objectId = mongoose.Schema.Types.ObjectId;
const converToSlug = require('../utils/convertToSlug')

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: objectId,
        ref: 'Category'
    },
    quantity: {
        type: Number,
        require: true
    },
    images: Array,
    color: {
        type: String,
        enum: ['black', 'red', 'green']
    },
    rating: {
        type: Number,
        postedby: {
            type: objectId,
            ref: "User"
        }
    }

}, {
    timestamps: true
});

productSchema.pre('save', async function (next) {

    this.slug = await converToSlug(this.title);
    next();
});




//Export the model
module.exports = mongoose.model('Product', productSchema);