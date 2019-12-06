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
        let columns = ['CommentBody', 'RestaurantName', 'Rating', 'DayPosted'];
        let table = 'Ratings';
        let json_body = JSON.parse(event.body);
        // Use this to do things like inserting n stuff
        const [rows, fields] = await promisePool.execute('UPDATE Ratings SET CommentBody = ?, RestaurantName = ?, Rating = ?, DayPosted = ? WHERE Commentid = ?', [json_body["CommentBody"], json_body["RestaurantName"], json_body["Rating"], json_body["DayPosted"], json_body["ratingid"]]);

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