// vendorController.js
// Express controller for Vendor entity

import express from 'express';
import {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor
} from './vendorService.js';

// If there was previous code, it would be commented out here.

const router = express.Router();

// GET /vendors (paginated)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await getVendors(page, limit);
  res.json(result);
});

// POST /vendors
router.post('/', async (req, res) => {
  try {
    const vendor = await createVendor(req.body);
    res.status(201).json(vendor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /vendors/:id
router.get('/:id', async (req, res) => {
  const vendor = await getVendorById(req.params.id);
  if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
  res.json(vendor);
});

// PUT /vendors/:id
router.put('/:id', async (req, res) => {
  const vendor = await updateVendor(req.params.id, req.body);
  if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
  res.json(vendor);
});

// DELETE /vendors/:id
router.delete('/:id', async (req, res) => {
  const vendor = await deleteVendor(req.params.id);
  if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
  res.json({ message: 'Vendor deleted' });
});

export default router;