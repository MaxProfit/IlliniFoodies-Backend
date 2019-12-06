'use strict';

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
    
    let getParams = {
        TableName: "IlliniFoodiesUserTable",
        Key: {
            Type: "User",
            Id: event["pathParameters"]["user-id"]
        }
    };
    
    let resp;
    try {
        resp = await documentClient.get(getParams).promise();
    } catch(err) {
        console.log(err);
        return return_response(err, 500);
    }
    

    let following = (resp["Item"]["Following"]).map(function(userId){
        return {
            Type: "User",
            Id: userId
        }
    });
    
    if (following.length == 0) {
        return return_response(JSON.stringify({
                Responses: {
                    IlliniFoodiesUserTable: []
                }
            }), 200);
    }
    
    let batchGetParams = {
        RequestItems: {
            "IlliniFoodiesUserTable": {
                Keys: following
            }
        }
    }
    
    try {
        resp = await documentClient.batchGet(batchGetParams).promise();
    } catch(err) {
        console.log(err);
        return return_response(err, 500);
    }

    return return_response(resp, 200);
};
