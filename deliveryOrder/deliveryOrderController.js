// deliveryOrderController.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateJWT } from '../auth/authMiddleware.js';
import { authorizeRole } from '../auth/roleMiddleware.js';
import {
  createDeliveryOrder,
  getDeliveryOrders,
  getDeliveryOrderFile,
  bulkUploadOrders
} from './deliveryOrderService.js';

const router = express.Router();

// === Multer Setup for file uploads ===
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ✅ Protect all /delivery-orders routes
router.use(authenticateJWT);

// === 1. Single Order Upload ===
router.post(
  '/upload',
  authorizeRole(['Vendor']),
  upload.single('file'),
  async (req, res) => {
    try {
      const { vendorId, deliveryDate, subscriptionType } = req.body;
      if (!req.file) return res.status(400).json({ error: 'File is required' });

      const filePath = req.file.path;
      const order = await createDeliveryOrder({
        vendorId,
        deliveryDate,
        subscriptionType,
        filePath
      });

      res.status(201).json({ message: "Order created", order });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// === 2. Bulk Orders Upload via CSV ===
router.post(
  '/upload-csv',
  authorizeRole(['Vendor', 'Admin']),
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      const result = await bulkUploadOrders(req.file.path);

      res.status(201).json({
        message: 'Orders uploaded successfully',
        count: result.count
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// === 3. Get All Orders ===
router.get(
  '/',
  authorizeRole(['Vendor', 'Admin']),
  async (req, res) => {
    const { page, limit } = req.query;
    const orders = await getDeliveryOrders(Number(page) || 1, Number(limit) || 10);
    res.json(orders);
  }
);

// === 4. Download Order File ===
router.get(
  '/download/:id',
  authorizeRole(['Vendor', 'Admin']),
  async (req, res) => {
    try {
      const filePath = await getDeliveryOrderFile(req.params.id);
      if (!filePath || !fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }
      res.download(filePath);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

export default router;