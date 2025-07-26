// deliveryOrderController.js
// Express controller for DeliveryOrder entity

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateJWT } from '../auth/authMiddleware.js';
import {
  createDeliveryOrder,
  getDeliveryOrders,
  getDeliveryOrderFile
} from './deliveryOrderService.js';

// If there was previous code, it would be commented out here.

const router = express.Router();

// Set up multer for file uploads
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Protect all /delivery-orders routes
router.use(authenticateJWT);

// POST /delivery-orders/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { vendorId, deliveryDate, subscriptionType } = req.body;
    if (!req.file) return res.status(400).json({ error: 'File is required' });
    const filePath = req.file.path;
    const { order, totalOrders } = await createDeliveryOrder({
      vendorId,
      deliveryDate,
      subscriptionType,
      filePath
    });
    res.status(201).json({ order, totalOrders });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /delivery-orders
router.get('/', async (req, res) => {
  const { vendor, date } = req.query;
  const orders = await getDeliveryOrders({ vendor, date });
  res.json(orders);
});

// GET /delivery-orders/download/:id
router.get('/download/:id', async (req, res) => {
  const filePath = await getDeliveryOrderFile(req.params.id);
  if (!filePath || !fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.download(filePath);
});

export default router;