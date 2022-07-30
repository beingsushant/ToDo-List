const express = require('express');
const connectToMongo = require('./db');
const app = express();


const port=8001;
connectToMongo();


app.use(express.json());


app.use('/api/auth',require('./routes/auth'));
app.use('/api/todo',require('./routes/todo'));


app.listen(port,() => {
    console.log("App successfully Listened On The Port")
});