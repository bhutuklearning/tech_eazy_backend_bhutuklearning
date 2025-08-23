// // vendorService.js
// import { Vendor } from './vendorModel.js';

// export async function createVendor(data) {
//   return await Vendor.create(data);
// }

// export async function getVendors(page = 1, limit = 10) {
//   const offset = (page - 1) * limit;
//   const { count, rows } = await Vendor.findAndCountAll({
//     offset,
//     limit,
//     order: [['id', 'ASC']]
//   });
//   return { total: count, vendors: rows };
// }

// export async function getVendorById(id) {
//   return await Vendor.findByPk(id);
// }

// export async function updateVendor(id, data) {
//   const vendor = await Vendor.findByPk(id);
//   if (!vendor) return null;
//   await vendor.update(data);
//   return vendor;
// }

// export async function deleteVendor(id) {
//   const vendor = await Vendor.findByPk(id);
//   if (!vendor) return null;
//   await vendor.destroy();
//   return vendor;
// }


// vendorService.js
import { Vendor } from './vendorModel.js';

export async function createVendor(data) {
  try {
    return await Vendor.create(data);
  } catch (err) {
    throw new Error(`Failed to create vendor: ${err.message}`);
  }
}

export async function getVendors(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const { count, rows } = await Vendor.findAndCountAll({
    offset,
    limit,
    order: [['id', 'ASC']]
  });
  return { total: count, page, limit, vendors: rows };
}

export async function getVendorById(id) {
  const vendor = await Vendor.findByPk(id);
  if (!vendor) throw new Error('Vendor not found');
  return vendor;
}

export async function updateVendor(id, data) {
  const vendor = await Vendor.findByPk(id);
  if (!vendor) throw new Error('Vendor not found');
  return await vendor.update(data);
}

export async function deleteVendor(id) {
  const vendor = await Vendor.findByPk(id);
  if (!vendor) throw new Error('Vendor not found');
  await vendor.destroy();
  return true;
}
