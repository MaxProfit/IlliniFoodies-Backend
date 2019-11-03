'use strict';

const AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient();

console.log("Loading function!");

exports.handler = async (event, context) => {
  
    let params = {
        TableName: "IlliniFoodies-Test1",
        Item: {
            restaurant: event.restaurant,
            food_name: event.food_name,
            desc: event.desc,
            price: event.price,
            dank: event.dank,
            price_per_pound: event.price_per_pound
        }
    };
  
    try {
        let doc = await documentClient.put(params).promise();
        return params;
    } catch(err) {
        console.log(err);
        return {
            statusCode: '500',
            body: err
        };
    }
};