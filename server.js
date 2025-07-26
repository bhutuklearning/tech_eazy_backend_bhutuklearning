import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import parcelRoutes from './parcel/parcelController.js';
import sequelize from './parcel/parcelModel.js';

// Assignment 2: New imports for modular features
import vendorRoutes from './vendor/vendorController.js';
import deliveryOrderRoutes from './deliveryOrder/deliveryOrderController.js';
import authRoutes, { User } from './auth/authController.js';

const app = express();
const PORT = 80; // as said in the assignment.

// Middleware
app.use(bodyParser.json());
app.use(express.json())

// Database connection
const db = new sqlite3.Database('./db/parcel.db', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// API routes
app.use('/api/v1/parcels', parcelRoutes);

// Assignment 2: New API routes
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/delivery-orders', deliveryOrderRoutes);
app.use('/api/v1/auth', authRoutes);

// Sync Sequelize models and create tables if they don't exist
/*
sequelize.sync().then(() => {
    console.log('Database & tables synced!');
    // Start the server inside the sync callback
    app.listen(PORT, () => {
        console.log(`Server is running on port number ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to sync database:', err);
});
*/

// Assignment 2: Sync all models and seed data
sequelize.sync({ alter: true }).then(async () => {
    console.log('Database & tables synced!');
    // Seed a couple of vendors and delivery orders if needed
    if (await User.count() === 0) {
        await User.create({ username: 'admin', password: 'admin123' });
    }
    // Add more seeding logic for vendors/orders if desired

    app.listen(PORT, () => {
        console.log(`Server is running on port number ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to sync database:', err);
});