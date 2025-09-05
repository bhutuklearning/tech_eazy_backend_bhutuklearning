import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import parcelRoutes from './parcel/parcelController.js';
import vendorRoutes from './vendor/vendorController.js';
import deliveryOrderRoutes from './deliveryOrder/deliveryOrderController.js';
import authRoutes from './auth/authController.js';

dotenv.config();

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// Root test route
app.get('/', (req, res) => {
    res.send('Welcome to the Parcel Management System API (DynamoDB version)!');
});

// API routes
app.use('/api/v1/parcels', parcelRoutes);
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/delivery-orders', deliveryOrderRoutes);
app.use('/api/v1/auth', authRoutes);

// Start server (no Sequelize sync now!)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port number ${PORT}`);
});