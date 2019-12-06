'use strict';

// get the client
const mysql = require('mysql2');
// create the pool
const pool = mysql.createPool(require( "./config.json" ));

exports.handler = async function(event, context) {
  
    let data = JSON.parse(event["responsePayload"]);
    let bulkValues = "";
    
    // map every restaurant's data to a tuple of values and concat those tuples together
    for (let r of data) {
      
      let valuesTuple = "(";
      let index = 0;
      for (let value of Object.values(r)){
        let sentinel = ", "
        if(index++ == Object.values(r).length - 1) {
          sentinel = ")";
        }
        
        // no quotes around numbers
        if(typeof(value) == "number"){
          valuesTuple = valuesTuple.concat(value + ", ");
        }
        
        // single quotes around strings
        else {
          valuesTuple = valuesTuple.concat('"' + value + '"' + sentinel); 
        }
        
      } // finished iterating thru all values for one restaurant
      
      bulkValues = bulkValues.concat(valuesTuple + ",");
    } // finsihed iterating thru all restaurants
    
    bulkValues = bulkValues.slice(0, bulkValues.length - 1);
    console.log(bulkValues + "\n")
    
    let body;
    let statusCode;
    try {
      const promisePool = pool.promise();
      
      const [rows, fields] = await promisePool.execute(
        "INSERT INTO Restaurants (YelpId, RestaurantName, PhoneNumber, Address, PictureURL, AvgPrice, AvgRating, WebsiteURL, Tags) VALUES " 
        + bulkValues);

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