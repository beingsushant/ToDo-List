const mongoose = require('mongoose');
const mongoUrl = 'mongodb://localhost:27017';

const connectToMongo = () => {
    mongoose.connect(mongoUrl,()=>{console.log("Db Succesfully Connected")})
}

module.exports = connectToMongo;