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
    let columns = ['CommentBody', 'RestaurantName', 'Rating', 'DayPosted'];
    let table = 'Ratings';
    // Use this to do things like inserting n stuff
    const [rows, fields] = await promisePool.execute('UPDATE Ratings SET CommentBody = ?, RestaurantName = ?, Rating = ?, DayPosted = ? WHERE Commentid = ?', [event.CommentBody, event.RestaurantName, event.Rating, event.DayPosted, event.ratingid]);

    
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