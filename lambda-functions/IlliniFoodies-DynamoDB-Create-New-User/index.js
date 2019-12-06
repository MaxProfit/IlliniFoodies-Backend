'use strict';

const AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  
    let params = {
        TableName: "IlliniFoodiesUserTable",
        Item: {
            Type: "User",
            Id: event["userName"],
            Following: [],
            FavoriteRestaurants: []
        }
    };
  
    try {
        let put = await documentClient.put(params).promise();
        return event;
    } catch(err) {
        console.log(err);
        return err;
    }
};