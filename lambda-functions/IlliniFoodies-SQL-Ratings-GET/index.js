'use strict';

// get the client
const mysql = require('mysql2');
// create the pool
const pool = mysql.createPool(require( "./config.json" ));

exports.handler = async function(event, context) {
 

  try {
    // now get a Promise wrapped instance of that pool
    const promisePool = pool.promise();
    // query database using promises
    let columns = ['Commentid', 'CommentBody', 'RestaurantName', 'Rating', 'DayPosted'];
    let table = 'Ratings';
    const [rows, fields] = await promisePool.query("SELECT ?? FROM ?? WHERE Commentid=?", [columns, table, event.ratingid]);
    
    console.log(rows);
    return {
      statusCode: '200',
      body: rows
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: '500',
      body: error
    };
  }

};