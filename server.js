const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const userModel = require('./models/userModel')
const quesModel = require('./models/questionModel')

const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const mongoose = require("mongoose");
MongoDbURL =  process.env.MONGODB_URL;
mongoose.connect(MongoDbURL);
var db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error : "));
db.once("open", function () {
  console.log("Database is Ready.... ");
});

app.get('/', (req,res) => {
    res.send('Hello,World!')
})
app.post('/api/signup' ,async(req,res) => {
  try {
    let user = await userModel.findOne({email:req.body.email});
    if(user) return res.status(400).send({status:false, msg:'User Alread Exist!'})
    user = await userModel.create(req.body)
    return res.status(200).send({status:true,msg:'User Created Successfully!' , user})
  } catch (error) {
    res.status(500).send({status:false,msg:'Internal Server Error!'})
  }
})
app.post('/api/login' ,async(req,res) => {
  try {
    let user = await userModel.findOne({email:req.body.email});
    if(!user || user.password !== req.body.password) return res.status(404).send({status:false, msg:'Invalid Credentials!'})
    
    return res.status(200).send({status:true,msg:'Logged in Successfully!' , user})
  } catch (error) {
    res.status(500).send({status:false,msg:'Internal Server Error!'})
  }
})
app.post('/api/question' ,async(req,res) => {
  try {
    let user = await userModel.findById(req.body.token);
    if(!user) return res.status(404).send({status:false, msg:'User Does not Exist!'})
    const question = await quesModel.create({user : user._id , question:req.body.question})
    return res.status(200).send({status:true,msg:'Added Successfully!' , question})
  } catch (error) {
    res.status(500).send({status:false,msg:'Internal Server Error!'})
  }
})

app.get('/api/question' , async(req,res) => {
  let question = await quesModel.find();
  return res.status(200).send({status:true,msg:'Fetched Successfully!' , question})
})
app.get('/api/users' , async(req,res) => {
  let user = await userModel.find();
  return res.status(200).send({status:true,msg:'Fetched Successfully!' , user})
})
app.listen(port, () => {
  console.log(`Your app listening at http://localhost:${port}`);
});