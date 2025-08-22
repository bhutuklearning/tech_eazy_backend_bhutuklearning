
// deliveryOrderService.js
// Service layer for DeliveryOrder entity

import { DeliveryOrder } from './deliveryOrderModel.js';
import { Vendor } from '../vendor/vendorModel.js';
import { Parcel } from '../parcel/parcelModel.js';
import { createParcel } from '../parcel/parcelService.js';
import DeliveryOrderDTO from './DeliveryOrderDTO.js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Helper: Parse CSV file and create parcels
export async function processCSVAndCreateParcels(filePath, vendorId) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Parse CSV with headers (safer than manual split)
  const records = parse(fileContent, {
    columns: true, // use first row as headers
    skip_empty_lines: true,
    trim: true
  });

  let totalOrders = 0;

  for (const [index, row] of records.entries()) {
    // Required fields check
    const requiredFields = [
      'trackingNumber',
      'customerName',
      'deliveryAddress',
      'contactNumber',
      'parcelSize',
      'weight'
    ];
    for (const field of requiredFields) {
      if (!row[field] || row[field].toString().trim() === '') {
        throw new Error(`Missing required field "${field}" in row ${index + 2}`);
      }
    }

    await createParcel({
      trackingNumber: row.trackingNumber,
      customerName: row.customerName,
      deliveryAddress: row.deliveryAddress,
      contactNumber: row.contactNumber,
      parcelSize: row.parcelSize,
      weight: parseFloat(row.weight),
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
