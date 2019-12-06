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
      //https://illinifoodies.xyz/restaurants/search/resturantname=Chipotle&minprice=5&maxprice=15&minrating=3&tags=Mexican+lunch
      //event["pathParameters"]["search-params"]
      let query_dict = event.queryStringParameters;
      //Leave "AND" and "OR" out of query to decide later

      //let first_base_query = "SELECT * FROM ?? WHERE true AND RestaurantName = ? AND AvgPrice > ? AND AvgPrice < ? AND AvgRating > ?";
      let first_base_query
      if (query_dict != null) {
        first_base_query = "SELECT * FROM (SELECT * FROM(";
        let name_query = "(SELECT * FROM Restaurants WHERE";
        if ("restaurantname" in query_dict && query_dict["restaurantname"] || !query_dict["tags"]) {
            name_query = name_query.concat(" true AND RestaurantName Like '%", query_dict["restaurantname"], "%'");
        } else{
          name_query = name_query.concat(" false ");
        }
        if ("minprice" in query_dict && query_dict["minprice"]) {
            name_query = name_query.concat(" AND AvgPrice > ", query_dict["minprice"]);
        }
        if ("maxprice" in query_dict && query_dict["maxprice"]) {
            name_query = name_query.concat(" AND AvgPrice < ", query_dict["maxprice"]);
        }
        if ("minrating" in query_dict && query_dict["minrating"]) {
            name_query = name_query.concat(" AND AvgRating > ", query_dict["minrating"]);
        }
        
        let tag_query = "(SELECT * FROM Restaurants WHERE false ";
        if ("tags" in query_dict && query_dict["tags"] != '') {
          let array_tag = query_dict["tags"].split(",");
          let x;
          for (x in array_tag) {
              tag_query = tag_query.concat(" OR Tags Like '%", array_tag[x], "%'");
          }
        }
        if ("minprice" in query_dict && query_dict["minprice"]) {
            tag_query = tag_query.concat(" AND AvgPrice > ", query_dict["minprice"]);
        }
        if ("maxprice" in query_dict && query_dict["maxprice"]) {
            tag_query = tag_query.concat(" AND AvgPrice < ", query_dict["maxprice"]);
        }
        if ("minrating" in query_dict && query_dict["minrating"]) {
            tag_query = tag_query.concat(" AND AvgRating > ", query_dict["minrating"]);
        }
        if (!("restaurantname" in query_dict) || !(query_dict["restaurantname"])) {
            first_base_query = first_base_query.concat(tag_query, " ORDER BY AvgRating DESC) UNION ", name_query); 
        } else{
            first_base_query = first_base_query.concat(name_query, " ORDER BY AvgRating DESC) UNION ", tag_query); 
        }
        
      
      first_base_query = first_base_query.concat(" ORDER BY AvgRating DESC)) AS TEMP) AS TEMP2 WHERE true");
        
        if ("limit" in query_dict && query_dict["limit"]) {
            first_base_query = first_base_query.concat(" LIMIT ", query_dict["limit"]);
        }
      } else{
        first_base_query = "SELECT * FROM ".concat(table)
      }
      
      
      
      console.log(first_base_query);
      const [rows, fields] = await promisePool.query(first_base_query);
      statusCode = 200;
      body = rows;
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