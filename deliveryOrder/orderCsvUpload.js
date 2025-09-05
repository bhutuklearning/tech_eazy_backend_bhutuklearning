// orderCsvUpload.js
import fs from "fs";
import csvParser from "csv-parser";
import { ddbDocClient } from "../db/dynamoClient.js";
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = "DeliveryOrdersTable";

// Upload orders from CSV
export const uploadOrdersFromCSV = async (filePath) => {
    const rows = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (row) => {
                rows.push(row);
            })
            .on("end", async () => {
                try {
                    // DynamoDB batch write (25 items max per request)
                    const chunks = [];
                    for (let i = 0; i < rows.length; i += 25) {
                        chunks.push(rows.slice(i, i + 25));
                    }

                    for (const chunk of chunks) {
                        const putRequests = chunk.map((row) => ({
                            PutRequest: {
                                Item: {
                                    id: uuidv4(), // DynamoDB PK
                                    trackingNumber: row.trackingNumber,
                                    customerName: row.customerName,
                                    deliveryAddress: row.deliveryAddress,
                                    contactNumber: row.contactNumber,
                                    parcelSize: row.parcelSize,
                                    weight: parseFloat(row.weight) || 0,
                                    status: "PENDING", // default
                                    createdAt: new Date().toISOString(),
                                },
                            },
                        }));

                        await ddbDocClient.send(
                            new BatchWriteCommand({
                                RequestItems: {
                                    [TABLE_NAME]: putRequests,
                                },
                            })
                        );
                    }

                    resolve({ success: true, count: rows.length });
                } catch (error) {
                    reject(error);
                }
            })
            .on("error", reject);
    });
};