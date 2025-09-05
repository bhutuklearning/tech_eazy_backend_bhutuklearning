// parcelService.js
import { v4 as uuidv4 } from "uuid";
import {
    PutCommand,
    ScanCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../db/dynamoClient.js";
import { PARCEL_TABLE } from "./parcelModel.js";

// Get all parcels
export const getAllParcels = async () => {
    const result = await ddbDocClient.send(
        new ScanCommand({
            TableName: PARCEL_TABLE,
        })
    );
    return result.Items || [];
};

// Get parcel by tracking number
export const getParcelByTrackingNumber = async (trackingNumber) => {
    const result = await ddbDocClient.send(
        new ScanCommand({
            TableName: PARCEL_TABLE,
            FilterExpression: "trackingNumber = :trackingNumber",
            ExpressionAttributeValues: {
                ":trackingNumber": trackingNumber,
            },
        })
    );
    return result.Items && result.Items.length > 0 ? result.Items[0] : null;
};

// Create parcel
export const createParcel = async (data) => {
    const parcel = {
        id: uuidv4(),
        trackingNumber: data.trackingNumber,
        customerName: data.customerName,
        deliveryAddress: data.deliveryAddress,
        contactNumber: data.contactNumber,
        parcelSize: data.parcelSize,
        weight: data.weight,
        vendorId: data.vendorId || null,
        createdAt: new Date().toISOString(),
    };

    await ddbDocClient.send(
        new PutCommand({
            TableName: PARCEL_TABLE,
            Item: parcel,
        })
    );

    return parcel;
};

// Update parcel
export const updateParcel = async (trackingNumber, data) => {
    const parcel = await getParcelByTrackingNumber(trackingNumber);
    if (!parcel) return null;

    const updatedParcel = {
        ...parcel,
        ...data,
        updatedAt: new Date().toISOString(),
    };

    await dynamoClient.send(
        new PutCommand({
            TableName: PARCEL_TABLE,
            Item: updatedParcel,
        })
    );

    return updatedParcel;
};

// Delete parcel
export const deleteParcel = async (trackingNumber) => {
    const parcel = await getParcelByTrackingNumber(trackingNumber);
    if (!parcel) return null;

    await dynamoClient.send(
        new DeleteCommand({
            TableName: PARCEL_TABLE,
            Key: { id: parcel.id },
        })
    );

    return parcel;
};