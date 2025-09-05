// vendorModel.js
// DynamoDB model functions for Vendor entity

import { ddbDocClient } from "../db/dynamoClient.js";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = "VendorsTable"; // must match your DynamoDB table name

// Create Vendor
export const createVendorDB = async (data) => {
  const item = {
    id: uuidv4(), // auto-generate ID
    subscriptionType: data.subscriptionType || "NORMAL",
    ...data,
    createdAt: new Date().toISOString(),
  };

  await ddbDocClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );

  return item;
};

// Get Vendors (simple scan with pagination)
export const getVendorsDB = async (limit = 10, lastKey = null) => {
  const params = {
    TableName: TABLE_NAME,
    Limit: limit,
    ExclusiveStartKey: lastKey || undefined,
  };

  const result = await ddbDocClient.send(new ScanCommand(params));
  return {
    vendors: result.Items || [],
    lastKey: result.LastEvaluatedKey || null,
  };
};

// Get Vendor by ID
export const getVendorByIdDB = async (id) => {
  const result = await ddbDocClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
  );
  return result.Item || null;
};

// Update Vendor
export const updateVendorDB = async (id, data) => {
  if (!data || Object.keys(data).length === 0) {
    throw new Error("No update data provided");
  }

  let updateExpr = "set";
  const exprAttrValues = {};
  const exprAttrNames = {};

  Object.keys(data).forEach((key) => {
    updateExpr += ` #${key} = :${key},`;
    exprAttrValues[`:${key}`] = data[key];
    exprAttrNames[`#${key}`] = key;
  });

  updateExpr = updateExpr.slice(0, -1); // remove trailing comma

  const result = await ddbDocClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: updateExpr,
      ExpressionAttributeValues: exprAttrValues,
      ExpressionAttributeNames: exprAttrNames,
      ReturnValues: "ALL_NEW",
    })
  );

  return result.Attributes;
};

// Delete Vendor
export const deleteVendorDB = async (id) => {
  await ddbDocClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
  );
  return true;
};