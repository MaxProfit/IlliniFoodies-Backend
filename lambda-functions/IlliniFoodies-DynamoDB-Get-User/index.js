'use strict';

const AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    let params = {
        TableName : 'IlliniFoodiesUserTable',
        Key: {
            Type: "User",
            Id: event["pathParameters"]["userid"]
        }
    };
    
    let body;
    let statusCode;
    try {
        body = await documentClient.get(params).promise();
        statusCode = 200;
    } catch(err) {
        console.log(err);
        statusCode = 500;
        body = err;
    }

    var response = {
        "statusCode": statusCode,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": JSON.stringify(body),
        "isBase64Encoded": false
    };
    
    return response;
};