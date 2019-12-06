'use strict';

const AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async function(event, context) {
    
    // set parameters for reading from table
    let params2 = {
        TableName : 'IlliniFoodiesUserTable',
        Key: {
            Type: "User",
            Id: event["pathParameters"]["userid"]
        }
    };
  
    let body2;
    let statusCode2;
    try {
        body2 = await documentClient.get(params2).promise();
        statusCode2 = 200;
    } catch(err) {
        console.log(err);
        statusCode2 = 500;
        body2 = err;
        return {
            "statusCode": statusCode2,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": JSON.stringify(body2),
            "isBase64Encoded": false
        };
    }
    
    let restaurantids = body2["Item"]["FavoriteRestaurants"]
    console.log(restaurantids)
    
    let r = parseInt(event["pathParameters"]["restaurant-id"])
    // let idx = restaurantids.find((restId) => {return parseInt(restId) === r})
    let idx = -1
    restaurantids.forEach((e, i) => {
        if (e === r) {
            idx = i;
        }
    })
    console.log("index: " + idx)
    
    if (idx === undefined) {
        let response3 = {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "isBase64Encoded": false
        };
    
        return response3;
    }
    
    let temp = "REMOVE FavoriteRestaurants[" + idx + "]"
    
    let params = {
        TableName : 'IlliniFoodiesUserTable',
        Key: {
            Type: "User",
            Id: event["pathParameters"]["userid"]
        },
        UpdateExpression: temp
    };    
  
    let body;
    let statusCode;
    try {
        body = await documentClient.update(params).promise();
        statusCode = 200;
    } catch(err) {
        console.log(err);
        statusCode = 500;
        body = err;
        return {
            "statusCode": statusCode,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": JSON.stringify(body),
            "isBase64Encoded": false
        };
    }
    
    
    let response = {
        "statusCode": statusCode,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "isBase64Encoded": false
    };
    
    return response;

};
