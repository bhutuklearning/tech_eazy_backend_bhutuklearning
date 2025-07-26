// vendorService.js
// Service layer for Vendor entity

import { Vendor } from './vendorModel.js';

// If there was previous code, it would be commented out here.

export async function createVendor(data) {
  return await Vendor.create(data);
}

export async function getVendors(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const { count, rows } = await Vendor.findAndCountAll({
    offset,
    limit,
    order: [['id', 'ASC']]
  });
  return { total: count, vendors: rows };
}

export async function getVendorById(id) {
  return await Vendor.findByPk(id);
}

export async function updateVendor(id, data) {
  const vendor = await Vendor.findByPk(id);
  if (!vendor) return null;
  await vendor.update(data);
  return vendor;
}

export async function deleteVendor(id) {
  const vendor = await Vendor.findByPk(id);
  if (!vendor) return null;
  await vendor.destroy();
  return vendor;
}