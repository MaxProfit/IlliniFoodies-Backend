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
    
    let params = {
        TableName : 'IlliniFoodiesUserTable',
        Key: {
            Type: "User",
            Id: userid
        },
        UpdateExpression: "SET Following = list_append(Following, :i)",
        ExpressionAttributeValues: {
            ':i': [followeduserid]
        }
    };
    
    let resp;
    try {
        resp = await documentClient.update(params).promise();
    } catch(err) {
        console.log(err);
        return return_response(err, 500);
    }
    
    return return_response(resp, 200);
};
