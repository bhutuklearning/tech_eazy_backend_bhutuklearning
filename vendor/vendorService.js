// vendorService.js
// Service layer for Vendor entity with DynamoDB

import {
  createVendorDB,
  getVendorsDB,
  getVendorByIdDB,
  updateVendorDB,
  deleteVendorDB,
} from "./vendorModel.js";

export async function createVendor(data) {
  return await createVendorDB(data);
}

export async function getVendors(page = 1, limit = 10) {
  // DynamoDB doesn’t support offset pagination (page numbers).
  // Instead, we return the lastKey for the next page.
  const { vendors, lastKey } = await getVendorsDB(limit);
  return { vendors, page, limit, lastKey };
}

export async function getVendorById(id) {
  const vendor = await getVendorByIdDB(id);
  if (!vendor) throw new Error("Vendor not found");
  return vendor;
}

export async function updateVendor(id, data) {
  const vendor = await updateVendorDB(id, data);
  if (!vendor) throw new Error("Vendor not found or update failed");
  return vendor;
}

export async function deleteVendor(id) {
  return await deleteVendorDB(id);
}