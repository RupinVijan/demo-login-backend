const express = require("express");
const cors = require("cors");
const { addData, getTableById } = require("./dbController");
const { uploadFile } = require("./s3Constroller");
const app = express();
const bcrypt = require('bcryptjs')
require("dotenv").config();
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const s3 = new AWS.S3({
  region: 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_KEY,
  })


const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req,res) => {
    res.send('Hello,World!')
})
app.post('/api/signup' ,async(req,res) => {
  let newItem = req.body;
  try {
    let user = await addData(newItem)
    return res.status(200).send({status:true,msg:'User Created Successfully!' , user})
  } catch (error) {
    res.status(500).send({status:false,msg:'Internal Server Error!'})
  }
})
app.post('/api/login' ,async(req,res) => {
  try {
    let user = await getTableById(req.body.email)
    if(!user || !bcrypt.compareSync(req.body.password, user.Item.password)) return res.status(404).send({status:false, msg:'Invalid Credentials!'})
    
    return res.status(200).send({status:true,msg:'Logged in Successfully!' , user})
  } catch (error) {
    res.status(500).send({status:false,msg:'Internal Server Error!'})
    console.log(error)
  }
})
app.get('/api/user/:id' ,async(req,res) => {
  try {
    let user = await getTableById(req.params.id)
    if(!user) return res.status(404).send({status:false, msg:'Invalid Credentials!'})
    
    return res.status(200).send({status:true,msg:'Logged in Successfully!' , user})
  } catch (error) {
    res.status(500).send({status:false,msg:'Internal Server Error!'})
    console.log(error)
  }
})

app.get('/get-signed-url', async (req, res) => {
  await s3.createPresignedPost({
    Fields: {
      key:uuidv4(),
    },
    Conditions: [
      ["starts-with", "$Content-Type", "image/"],
      ["content-length-range", 0, 1000000],
    ],
    Expires: 30,
    Bucket: 'test-website-infobility',
  }, (err, signed) => {
    res.json(signed);
  });
})

app.listen(port, () => {
  console.log(`Your app listening at http://localhost:${port}`);
});