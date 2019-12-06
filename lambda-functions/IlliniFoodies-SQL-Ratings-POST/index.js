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
    let columns = ['RestaurantId', 'UserId', 'Comment', 'DatePosted', 'Rating'];
    let table = 'Ratings';
    // const [rows, fields] = await promisePool.query("SELECT ?? FROM ??", [columns, table]);
    // await Promise.all([promisePool.query('select sleep(2)'), promisePool.query('select sleep(3)')]);
    // Use this to do things like inserting n stuff
    let json_body = JSON.parse(event.body);
    let RestaurantId = json_body["RestaurantId"];
    let UserId = json_body["UserId"];
    let Comment = json_body["Comment"];
    let DatePosted = json_body["DatePosted"];
    let Rating = json_body["Rating"];
    const [rows, fields] = await promisePool.execute('INSERT INTO Ratings (RestaurantId, UserId, Comment, DatePosted, Rating) VALUES (?, ?, ?, ?, ?)', [RestaurantId, UserId, Comment, DatePosted, Rating]);

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