'use strict';

const AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient();

console.log("Loading function!");

exports.handler = async (event, context) => {
  
    let params = {
        TableName : 'IlliniFoodies-Test1'
    };
  
    try {
        let doc = await documentClient.scan(params).promise();
        return doc;
    } catch(err) {
        console.log(err);
        return {
            statusCode: '500',
            body: err
        };
    }
};