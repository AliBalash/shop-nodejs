const mongooes = require('mongoose');
const bcrypt = require('bcryptjs');
const objectId = mongooes.Schema.Types.ObjectId;
const userSchema = new mongooes.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user"
    },
    cart: {
        type: Array,
        default: []
    },
    address: [{
        type: objectId, ref: "Address"
    }]
    ,
    wishlist: [{
        type: objectId, ref: "Product"
    }],
    refreshToken: {
        type: String
    }
},
    {
        timestamps: true
    }
)

userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hashSync(this.password, 8);
    next();
})



userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compareSync(enteredPassword, this.password);
}



module.exports = mongooes.model('User', userSchema, 'User');