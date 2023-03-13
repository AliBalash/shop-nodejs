const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 2020;
const dbConnect = require('./config/dbConnect')()
const { notFound, errorHandler } = require('./middlewares/errorHandler')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/authRoute');
const productRoute = require('./routes/productRoute');

//  middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser( ))

//  Routes
app.use('/api/user', authRouter);
app.use('/api/product', productRoute);


app.use(notFound);
app.use(errorHandler)

//  Server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})
