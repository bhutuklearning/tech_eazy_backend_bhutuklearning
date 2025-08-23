// vendorController.js
import express from 'express';
import {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor
} from './vendorService.js';

const router = express.Router();

// GET /vendors (paginated)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getVendors(page, limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
  try {
    const vendor = await getVendorById(req.params.id);
    res.json(vendor);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// PUT /vendors/:id
router.put('/:id', async (req, res) => {
  try {
    const vendor = await updateVendor(req.params.id, req.body);
    res.json(vendor);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// DELETE /vendors/:id
router.delete('/:id', async (req, res) => {
  try {
    await deleteVendor(req.params.id);
    res.json({ message: 'Vendor deleted' });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

export default router;
