// deliveryOrderService.js
import {
  createDeliveryOrderDB,
  getDeliveryOrdersDB,
  getDeliveryOrderByIdDB,
  updateDeliveryOrderDB,
  deleteDeliveryOrderDB,
} from "./deliveryOrderModel.js";

import { uploadOrdersFromCSV } from "./orderCsvUpload.js";

// === Create new order ===
export async function createDeliveryOrder(data) {
  return await createDeliveryOrderDB(data);
}

// === Get all orders with pagination ===
export async function getDeliveryOrders(page = 1, limit = 10) {
  const { deliveryOrders, lastKey } = await getDeliveryOrdersDB(limit);
  return { deliveryOrders, page, limit, lastKey };
}

// === Get order by ID ===
export async function getDeliveryOrderById(id) {
  const order = await getDeliveryOrderByIdDB(id);
  if (!order) throw new Error("Delivery order not found");
  return order;
}

// === Update order ===
export async function updateDeliveryOrder(id, data) {
  const order = await updateDeliveryOrderDB(id, data);
  if (!order) throw new Error("Delivery order not found or update failed");
  return order;
}

// === Delete order ===
export async function deleteDeliveryOrder(id) {
  return await deleteDeliveryOrderDB(id);
}

// === Bulk upload orders via CSV ===
export async function bulkUploadOrders(filePath) {
  return await uploadOrdersFromCSV(filePath);
}

// === Get file path for order download ===
export async function getDeliveryOrderFile(id) {
  const order = await getDeliveryOrderByIdDB(id);
  if (!order) throw new Error("Delivery order not found");
  if (!order.filePath) throw new Error("No file attached to this order");

  return order.filePath;
}