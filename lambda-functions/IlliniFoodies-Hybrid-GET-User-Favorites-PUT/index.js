'use strict';

const mysql = require('mysql2');
const pool = mysql.createPool(require( "./config.json" ));
const AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async function(event, context) {
    let RestaurantId = parseInt(event["pathParameters"]["restaurant-id"]);
    console.log(typeof(RestaurantId));
    
    // set parameters for reading from table
    let params = {
        TableName : 'IlliniFoodiesUserTable',
        Key: {
            Type: "User",
            Id: event["pathParameters"]["userid"]
        },
        UpdateExpression: "SET FavoriteRestaurants = list_append(FavoriteRestaurants, :i)",
        ExpressionAttributeValues: {
            ':i': [RestaurantId]
        }
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
