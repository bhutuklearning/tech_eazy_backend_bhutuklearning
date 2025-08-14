// vendorModel.js
// Vendor model using Sequelize, with ENUM for subscriptionType and one-to-many relation to DeliveryOrder

import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../parcel/parcelModel.js'; // Reuse the same sequelize instance (same DB)

// If there was previous code, it would be commented out here.

// Vendor model definition
export const Vendor = sequelize.define('Vendor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  vendorName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  subscriptionType: {
    type: DataTypes.ENUM('NORMAL', 'PRIME', 'VIP'),
    allowNull: false,
    defaultValue: 'NORMAL'
  }
}, {
  timestamps: true
});

// DeliveryOrder model will be associated in its own file

export default Vendor;