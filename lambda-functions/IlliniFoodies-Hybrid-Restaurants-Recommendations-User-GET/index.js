'use strict';

const mysql = require('mysql2');
const pool = mysql.createPool(require( "./config.json" ));
const AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient();

const return_response = async (body, statusCode) => {
    return {
        "statusCode": statusCode,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": JSON.stringify(body),
        "isBase64Encoded": false
    };
}

exports.handler = async function(event, context) {

    // set parameters for reading from table
    let params = {
        TableName : 'IlliniFoodiesUserTable',
        Key: {
            Type: "User",
            Id: event["pathParameters"]["userid"]
        }
    };
  
    let resp;
    try {
        resp = await documentClient.get(params).promise();
    } catch(err) {
        console.log(err);
        return return_response(err, 500);
    }
    
    let following = resp["Item"]["Following"];
    
    // Batch get item on User and userid of Following person element
    // Get the people you follow's favorite restaurants
    // Then you can do a sql query that puts their favorites on top that are within your price range
    // if the results are less than like 10 (because you have no friends lol) 
    // Then populate the rest with your basic parameters after
  
    try {
        const promisePool = pool.promise();
        let table = 'Restaurants';
        const [rows, fields] = await promisePool.query("SELECT * FROM ?? WHERE RestaurantId IN (?)", [table, 1269]);
        return return_response(rows, 200);
    } catch(err) {
        console.log(err);
        return return_response(err, 500);
    }

};
