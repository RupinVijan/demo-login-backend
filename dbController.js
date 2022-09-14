const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs')
require("dotenv").config();


AWS.config.update({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_KEY,
});


const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'test-website';


const addData = async(newItem) =>{
    const salt = await  bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(newItem.password, salt);
    try {
        const params = {
            TableName: TABLE_NAME,
            Item: {
                "email":newItem.email,
                "password":hashedPassword,
                image:newItem.image
            }
            
        };
        return await dynamoClient.put(params).promise();
    }
     catch (error) {
        console.log(error)
    }
}

const getTableById = async (email) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            email,
        },
    };
    return await dynamoClient.get(params).promise();
};
module.exports = {getTableById , addData}