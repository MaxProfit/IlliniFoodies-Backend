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
    let columns = ['CommentBody', 'RestaurantName', 'Rating', 'DayPosted'];
    let table = 'Ratings';
    let json_body = JSON.parse(event.body);
    let CommentBody = json_body["commentBody"];
    let RestaurantName = json_body["restaurantName"];
    let Rating = json_body["rating"];
    let DayPosted = json_body["dayPosted"];
    const [rows, fields] = await promisePool.execute('INSERT INTO Ratings (CommentBody, RestaurantName, Rating, DayPosted) VALUES (?, ?, ?, ?)', [CommentBody, RestaurantName, Rating, DayPosted]);

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