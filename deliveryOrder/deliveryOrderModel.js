// deliveryOrderModel.js
// DynamoDB model functions for DeliveryOrder entity

import { ddbDocClient } from "../db/dynamoClient.js";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = "DeliveryOrdersTable"; // must match your DynamoDB table name


// Create Delivery Order
export const createDeliveryOrderDB = async (data) => {
  const item = {
    id: uuidv4(),
    vendorId: data.vendorId || null,
    deliveryDate: data.deliveryDate || null,
    subscriptionType: data.subscriptionType || "NORMAL",
    filePath: data.filePath || null,   // ✅ Store uploaded file
    status: data.status || "PENDING",
    items: data.items || [],
    totalPrice: data.totalPrice || 0,
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

// Get Delivery Orders (with pagination)
export const getDeliveryOrdersDB = async (limit = 10, lastKey = null) => {
  const params = {
    TableName: TABLE_NAME,
    Limit: limit,
    ExclusiveStartKey: lastKey || undefined,
  };

  const result = await ddbDocClient.send(new ScanCommand(params));
  return {
    deliveryOrders: result.Items || [],
    lastKey: result.LastEvaluatedKey || null,
  };
};

// Get Delivery Order by ID
export const getDeliveryOrderByIdDB = async (id) => {
  const result = await ddbDocClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
  );
  return result.Item || null;
};

// Update Delivery Order
export const updateDeliveryOrderDB = async (id, data) => {
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

  updateExpr = updateExpr.slice(0, -1);

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

// Delete Delivery Order
export const deleteDeliveryOrderDB = async (id) => {
  await ddbDocClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    })
  );
  return true;
};