'use strict';

// get the client
const mysql = require('mysql2');
// create the pool
const pool = mysql.createPool(require( "./config.json" ));

exports.handler = async function(event, context) {

    let body;
    let statusCode;
    try {
        // now get a Promise wrapped instance of that pool
        const promisePool = pool.promise();
        // query database using promises
        let table = 'Ratings';
        let restaurant_name = event["pathParameters"]["restaurant-name"];
        
        // Right here we need to translate all of the - and _ to spaces!
        
        const [rows, fields] = await promisePool.query("SELECT * FROM ?? WHERE RestaurantName=?", [table, restaurant_name]);
        body = rows;
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