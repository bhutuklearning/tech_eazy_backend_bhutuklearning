# Parcel Management System

## Overview
This project is a Parcel Management System built with Node.js, Express, and SQLite. It provides a RESTful API for managing parcels, allowing users to create, read, update, and delete parcel information.

## Project Structure
```
parcel-management-system
├── parcel
│   ├── parcelModel.js
│   ├── parcelService.js
│   └── parcelController.js
├── db
│   └── parcel.db
├── server.js
├── package.json
├── README.md
└── postman_collection.json
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd parcel-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the server**
   ```bash
   npm start
   ```

   The server will start on **port 80**.

## API Endpoints

- **GET /api/v1/parcels**: To list all parcels
- **GET /api/v1/parcels/:trackingId**: Get the parcel by tracking ID
- **POST /api/v1/parcels**: Create a new parcel
- **PUT /api/v1/parcels/:trackingId**: Update a parcel
- **DELETE /api/v1/parcels/:trackingId**: Delete a parcel

## Database
The SQLite database file is stored at `db/parcel.db`.  
It will be automatically created when you run the server for the first time.  
The schema is managed via Sequelize in `parcel/parcelModel.js`.
