import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: "ap-south-1",
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

export { ddbDocClient };