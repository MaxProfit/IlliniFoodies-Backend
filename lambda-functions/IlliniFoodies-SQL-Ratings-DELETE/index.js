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
    let table = 'Ratings';
    // Use this to do things like inserting n stuff
    const [rows, fields] = await promisePool.execute('DELETE FROM Ratings WHERE Commentid = ?', [event.ratingid]);
    
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