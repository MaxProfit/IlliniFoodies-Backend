'use strict';

// get the client
const mysql = require('mysql2');
// create the pool
const pool = mysql.createPool(require( "./config.json" ));

exports.handler = async function(event, context) {
  
    let body;
    let statusCode;
    try {
      const promisePool = pool.promise();
      let table = 'Restaurants';
      const [rows, fields] = await promisePool.query("SELECT * FROM ??", [table]);
      body = rows
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