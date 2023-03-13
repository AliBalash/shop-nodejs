const mongooes = require('mongoose');

const dbConenct = () => {
    mongooes.connect(process.env.MONGO_URL).then(() => {
        console.log('Mongoo Connected Successfully');
    }).catch((error) => {
        console.log('Mongoo Error : ' + error)
    })
}

module.exports = dbConenct;