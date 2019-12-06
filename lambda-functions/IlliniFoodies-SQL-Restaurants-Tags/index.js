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
      const [rows, fields] = await promisePool.query("SELECT Tags FROM Restaurants");
      let arr = []
      rows.forEach(function(dictionary_name){
        arr.push(...dictionary_name["Tags"].split(","));
      });
      body = [...new Set(arr)];
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
      "body": body,
      "isBase64Encoded": false
    };
    
    return response;

};