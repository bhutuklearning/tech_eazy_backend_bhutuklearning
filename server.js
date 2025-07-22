import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import parcelRoutes from './parcel/parcelController.js';

const app = express();
const PORT = 5000;

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
app.use('/parcels', parcelRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});