# Parcel Management System

A comprehensive API-based solution for managing parcels, vendors, and delivery orders with role-based authentication.

## 📋 Overview

The Parcel Management System is a robust backend application built with Node.js, Express, and SQLite. It provides a complete solution for tracking parcels, managing vendors, and organizing delivery orders with secure authentication and role-based access control.

## ✨ Features

- **Parcel Management**: Create, read, update, and delete parcel information
- **Vendor Management**: Register and manage delivery vendors
- **Delivery Order System**: Assign parcels to vendors for delivery
- **Role-Based Access Control**: Admin and Vendor roles with appropriate permissions
- **Authentication**: Secure JWT-based authentication
- **Data Validation**: DTO-based validation for data integrity

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/parcel-management-system.git
   cd parcel-management-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will start on port 8080. You can access the API at `http://localhost:8080`.

## 🔑 API Endpoints

### Authentication

- **POST /api/v1/auth/register** - Register a new user (Admin or Vendor)
- **POST /api/v1/auth/login** - Login and receive JWT token

### Parcels

- **GET /api/v1/parcels** - Get all parcels (Admin only)
- **GET /api/v1/parcels/:trackingNumber** - Get parcel by tracking number (Admin only)
- **GET /api/v1/parcels/public/:trackingNumber** - Public endpoint to track a parcel
- **POST /api/v1/parcels** - Create a new parcel (Admin only)
- **PUT /api/v1/parcels/:trackingNumber** - Update a parcel (Admin only)
- **DELETE /api/v1/parcels/:trackingNumber** - Delete a parcel (Admin only)
- **POST /api/v1/parcels/dto** - Create a parcel with DTO validation (Admin only)

### Vendors

- **GET /api/v1/vendors** - Get all vendors (Admin only)
- **GET /api/v1/vendors/:id** - Get vendor by ID (Admin only)
- **POST /api/v1/vendors** - Create a new vendor (Admin only)
- **PUT /api/v1/vendors/:id** - Update a vendor (Admin only)
- **DELETE /api/v1/vendors/:id** - Delete a vendor (Admin only)

### Delivery Orders

- **GET /api/v1/delivery-orders** - Get all delivery orders (Admin only)
- **GET /api/v1/delivery-orders/vendor** - Get vendor's assigned delivery orders (Vendor only)
- **POST /api/v1/delivery-orders** - Create a new delivery order (Admin only)
- **PUT /api/v1/delivery-orders/:id/status** - Update delivery order status (Vendor only)

## 📁 Project Structure

```
parcel-management-system/
├── auth/                  # Authentication related files
│   ├── authController.js  # Auth routes and user model
│   ├── authMiddleware.js  # JWT verification middleware
│   ├── jwtUtils.js        # JWT generation utilities
│   └── roleMiddleware.js  # Role-based access control
├── db/                    # Database files
│   └── parcel.db          # SQLite database
├── deliveryOrder/         # Delivery order module
│   ├── DeliveryOrderDTO.js
│   ├── deliveryOrderController.js
│   ├── deliveryOrderModel.js
│   └── deliveryOrderService.js
├── parcel/                # Parcel module
│   ├── parcelController.js
│   ├── parcelDTO.js
│   ├── parcelModel.js
│   └── parcelService.js
├── vendor/                # Vendor module
│   ├── vendorController.js
│   ├── vendorModel.js
│   └── vendorService.js
├── .gitignore
├── package.json
└── server.js             # Main application entry point
```

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **API Testing**: Postman

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- HTTP-only cookies for token storage
- Input validation

## 📝 Usage Examples

### Register an Admin User

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123", "role": "Admin"}'
```

### Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Create a Parcel

```bash
curl -X POST http://localhost:8080/api/v1/parcels \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=YOUR_JWT_TOKEN" \
  -d '{
    "customerName": "John Doe",
    "deliveryAddress": "123 Main St, City",
    "trackingNumber": "TRK12345",
    "contactNumber": "555-1234",
    "parcelSize": "MEDIUM",
    "weight": 2.5
  }'
```

---

## 👨‍💻 Author

Amritanshu Goutam
