"use strict";

const AWS = require("aws-sdk");
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


exports.handler = async (event) => {
    
    let userid = event["pathParameters"]["user-id"];
    let followeduserid = event["pathParameters"]["followed-user-id"];
    
    let getParams = {
        TableName: "IlliniFoodiesUserTable",
        Key: {
            Type: "User",
            Id: userid
        }
    };
    
    
    let resp;
    try {
        resp = await documentClient.get(getParams).promise();
    } catch(err) {
        console.log(err);
        return return_response(err, 500);
    }
    
    let followingids = resp["Item"]["Following"]
    let r = followeduserid
    // let idx = restaurantids.find((restId) => {return parseInt(restId) === r})
    let idx = -1;
    followingids.forEach((e, i) => {
        if (e === r) {
            idx = i;
        }
    })
    
    if (idx === undefined || idx === -1) {
        return return_response("Id " + idx + " not in Following", 500);
    }
    
    let temp = "REMOVE Following[" + idx + "]"
    
    let params = {
        TableName : 'IlliniFoodiesUserTable',
        Key: {
            Type: "User",
            Id: userid
        },
        UpdateExpression: temp
    }; 
    
    try {
        resp = await documentClient.update(params).promise();
    } catch(err) {
        console.log(err);
        return return_response(err, 500);
    }
    
    return return_response(resp, 200);

};
