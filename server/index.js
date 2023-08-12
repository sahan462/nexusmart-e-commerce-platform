const express = require("express");
const {connect} = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();

const regLog = require('./routes/UserRegisterLogRoute');
const item = require('./routes/ItemRoute');
const cart = require('./routes/CartRoute');

app.use(cors({
  credentials:true,
  origin:'http://localhost:3000',
}));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

connect(process.env.MONGO_URL)
  .then(()=>console.log("connected to mongodb..."))
  .catch(()=>console.log("Could not connect to mongodb..."));


app.use('/auth', regLog);
app.use('/items', item);
app.use('/cart', cart);

const port = 5000;
app.listen(port, ()=>{
  console.log(`listing on port ${port}...`);
})
