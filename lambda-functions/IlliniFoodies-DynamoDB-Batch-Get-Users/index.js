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

    let userIds = (event["pathParameters"]["user-ids"]).split(",").map(function(userId){
        return {
            Type: "User",
            Id: userId
        }
    });
    
    if (event["pathParameters"]["user-ids"] == null) {
        return return_response(JSON.stringify({
                Responses: {
                    IlliniFoodiesUserTable: []
                }
            }), 200);
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
        return return_response(err, 500);
    }

    return return_response(resp, 200);
};
