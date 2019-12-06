'use strict';

const AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    let params = {
        TableName : 'IlliniFoodiesUserTable',
        IndexName: 'Type-Nickname-index',
        KeyConditionExpression: "#type = :type and begins_with(Nickname, :searchValue)",
        ExpressionAttributeValues: {
            ":type" : "User",
            ":searchValue": event["pathParameters"]["search"]
        },
        ExpressionAttributeNames: {
            "#type": "Type"
        }
    };
    
    let body;
    let statusCode;
    try {
        body = await documentClient.query(params).promise();
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