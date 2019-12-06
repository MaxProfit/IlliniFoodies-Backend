'use strict';

const mysql = require('mysql2');
const pool = mysql.createPool(require( "./config.json" ));
const AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async function(event, context) {

    // set parameters for reading from table
    let params = {
        TableName : 'IlliniFoodiesUserTable',
        Key: {
            Type: "User",
            Id: event["pathParameters"]["user-id"]
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
        return {
            "statusCode": statusCode,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": JSON.stringify(body),
            "isBase64Encoded": false
        };
    }
    
    let restaurantids = Object.values(body["Item"]["FavoriteRestaurants"]);
    console.log(restaurantids);
    
  
    try {
        const promisePool = pool.promise();
        let table = 'Ratings';
        const [rows, fields] = await promisePool.query(
            "SELECT * FROM Ratings WHERE UserId = '" + event["pathParameters"]["user-id"] + "'");
        
        rows.forEach((row) => {
            restaurantids.splice(restaurantids.indexOf(row["RatingId"]), 1)
        })
        
        const [rows1, fields1] = await promisePool.query("SELECT * FROM Restaurants WHERE RestaurantId IN (?)", restaurantids);
            
        body = rows1;
        statusCode = 200;
    } catch(err) {
        console.log(err);
        statusCode = 500;
        body = err;
    }
    
    
    
    
    let response = {
        "statusCode": statusCode,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": JSON.stringify(body),
        "isBase64Encoded": false
    };
    
    return response;

};
