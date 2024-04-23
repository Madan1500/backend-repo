import * as uuid from "uuid";
import AWS from "aws-sdk";
const dynamoDb = new AWS.DynamoDB.DocumentClient();
export async function main(event, context) {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.tableName,
        Item: {
            // The attributes of the item to be created
            userId: event.requestContext.identity.cognitoIdentityId, // The id of the author
            noteId: uuid.v1(), // A unique uuid
            content: data.content, // Parsed from request body
            attachment: data.attachment, // Parsed from request body
            createdAt: Date.now(), // Current Unix timestamp
        },
    };
    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // for CORS
                'Access-Control-Allow-Credentials': true, // for cookies, authorization headers, etc.
                'Content-Type': 'application/json', // for your body-parser
            },
            body: JSON.stringify(params.Item),
        };
    } catch (e) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*', // for CORS
                'Access-Control-Allow-Credentials': true, // for cookies, authorization headers, etc.
                'Content-Type': 'application/json', // for your body-parser
            },
            body: JSON.stringify({ error: e.message }),
        };
    }
}