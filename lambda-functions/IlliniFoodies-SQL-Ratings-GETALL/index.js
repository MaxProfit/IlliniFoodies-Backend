'use strict';

// get the client
const mysql = require('mysql2');
const AWS = require("aws-sdk");
// create the pool
const pool = mysql.createPool(require( "./config.json" ));
var documentClient = new AWS.DynamoDB.DocumentClient();

const return_response = async (body, statusCode) => {
    return {
        "statusCode": statusCode,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": JSON.stringify(body),
        "isBase64Encoded": false
    };
}

exports.handler = async function(event, context) {
    
  
    let body;
    let statusCode;
    try {
      // now get a Promise wrapped instance of that pool
      const promisePool = pool.promise();
      // query database using promises
      const [rows, fields] = await promisePool.query("SELECT * FROM Ratings NATURAL JOIN Restaurants ORDER BY DatePosted DESC");
      console.log(rows);
      body = rows
      statusCode = 200;
    } catch(err) {
      console.log(err);
      statusCode = 500;
      body = err;
    }
    
    const promisePool2 = pool.promise();
    const [rows2, fields2] = await promisePool2.query("SELECT UserId FROM Ratings NATURAL JOIN Restaurants");
    let arr = [];
    console.log(rows2)
    for(var i = 0; i < rows2.length; i++){
        arr.push(rows2[i].UserId);
    }
    console.log(arr)
    arr = [...new Set(arr)];
    let id_str = ""
    arr.forEach(element => id_str = id_str.concat(element.toString(), ","));
    if(id_str != ""){
        id_str = id_str.substring(0, id_str.length - 1);   
    }
    console.log(id_str);
    console.log("this is the id_str comma sep:".concat(id_str));
    let userIds = (id_str).split(",").map(function(userId){
        return {
            Type: "User",
            Id: userId
        }
    });
    
    if (id_str == "") {
        return JSON.stringify({
                Responses: {
                    IlliniFoodiesUserTable: []
                }
            });
    }
    
    let batchGetParams = {
        RequestItems: {
            "IlliniFoodiesUserTable": {
                Keys: userIds
            }
        }
    }
    
    try {
        var resp = await documentClient.batchGet(batchGetParams).promise();
    } catch(err) {
        console.log(err);
        return err;
    }
    console.log(resp["Responses"]["IlliniFoodiesUserTable"]);
    let temp = {}
    for(var i = 0; i < resp["Responses"]["IlliniFoodiesUserTable"].length; i++){
        temp[arr[i]] = resp["Responses"]["IlliniFoodiesUserTable"][i]["Nickname"]
    }
    body.forEach(element => element["Nickname"] = temp[element["UserId"]]);
    console.log(temp);
    return return_response(body, 200);
};