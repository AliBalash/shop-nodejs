const mongoose = require('mongoose');

const validateMongoId = (id)=>{

    console.log('ObjectId Validator : ' + mongoose.Types.ObjectId.isValid(id))

    if(! mongoose.Types.ObjectId.isValid(id))

    throw new Error('This ID Is Not Valid Or Not Found')
}

module.exports = validateMongoId;