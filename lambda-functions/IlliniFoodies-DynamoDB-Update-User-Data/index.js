'use strict';

const AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    let json_body = JSON.parse(event.body);
    let userid = event["pathParameters"]["userid"];
    let picture = json_body["Picture"];
    let priceMin = json_body["PriceMin"];
    let priceMax = json_body["PriceMax"];
    let nickname = json_body["Nickname"];
    let following = json_body["Following"];
    
    // add a default image if an invalid image was entered
    if(!(picture.endsWith("png")) && !(picture.endsWith("jpg")) && !(picture.endsWith("jpeg"))){
        picture = "https://i.imgur.com/Om2NJm1.jpg?1"; // default uiuc image
    }
        
    let params = {
        TableName: "IlliniFoodiesUserTable",
        Item: {
            Type: "User",
            Id: userid,
            PriceMin: priceMin,
            PriceMax: priceMax,
            Nickname: nickname,
            Picture: picture,
            Following: [],
            FavoriteRestaurants: []
        }
    };
    
    let body;
    let statusCode;
    try {
        body = await documentClient.put(params).promise();
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