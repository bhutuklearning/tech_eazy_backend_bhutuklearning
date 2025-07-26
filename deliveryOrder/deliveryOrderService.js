// deliveryOrderService.js
// Service layer for DeliveryOrder entity

import { DeliveryOrder } from './deliveryOrderModel.js';
import { Vendor } from '../vendor/vendorModel.js';
import { Parcel } from '../parcel/parcelModel.js';
import { createParcel } from '../parcel/parcelService.js';
import DeliveryOrderDTO from './DeliveryOrderDTO.js';
import fs from 'fs';
import path from 'path';

// If there was previous code, it would be commented out here.

// Helper: Parse CSV file and create parcels
export async function processCSVAndCreateParcels(filePath, vendorId) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n').filter(Boolean);
  let totalOrders = 0;
  for (const line of lines) {
    // Simple CSV: customerName,deliveryAddress,trackingNumber,contactNumber,parcelSize,weight
    const [customerName, deliveryAddress, trackingNumber, contactNumber, parcelSize, weight] = line.split(',');
    if (!customerName || !deliveryAddress || !trackingNumber) continue;
    await createParcel({
      customerName,
      deliveryAddress,
      trackingNumber,
      contactNumber,
      parcelSize,
      weight: parseFloat(weight),
      vendorId
    });
    totalOrders++;
  }
  return totalOrders;
}

// Create DeliveryOrder and process file
export async function createDeliveryOrder({ vendorId, deliveryDate, subscriptionType, filePath }) {
  const totalOrders = await processCSVAndCreateParcels(filePath, vendorId);
  const order = await DeliveryOrder.create({
    vendorId,
    deliveryDate,
    subscriptionType,
    filePath
  });
  return { order, totalOrders };
}

// Get delivery orders with optional filters
export async function getDeliveryOrders({ vendor, date }) {
  const where = {};
  if (vendor) where.vendorId = vendor;
  if (date) where.deliveryDate = date;
  else where.deliveryDate = new Date().toISOString().slice(0, 10); // today's orders
  const orders = await DeliveryOrder.findAll({ where, include: Vendor });
  return orders.map(order => new DeliveryOrderDTO({
    vendorName: order.Vendor.vendorName,
    date: order.deliveryDate,
    totalOrders: 0, // Could be calculated if needed
    fileLink: `/delivery-orders/download/${order.id}`
  }));
}

// Get file path for download
export async function getDeliveryOrderFile(orderId) {
  const order = await DeliveryOrder.findByPk(orderId);
  if (!order) return null;
  return order.filePath;
}