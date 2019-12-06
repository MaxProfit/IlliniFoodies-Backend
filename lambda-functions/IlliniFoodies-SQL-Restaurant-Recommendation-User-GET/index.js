'use strict';

const mysql = require('mysql2');
const pool = mysql.createPool(require( "./config.json" ));

const return_response = (body, statusCode) => {
    return {
        "statusCode": statusCode,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": JSON.stringify(body),
        "isBase64Encoded": false
    };
}

exports.handler = async (event, context) => {
    let userid = event["pathParameters"]["userid"];
    
    try {
      const promisePool = pool.promise();
      let table = 'Restaurants';
      const [rows, fields] = await promisePool.query("SELECT * FROM ?? ORDER BY AvgRating DESC, AvgPrice ASC LIMIT 21", [table]);
      return return_response(rows, 200);
    } catch(err) {
      console.log(err);
      return return_response(err, 500);
    }
};