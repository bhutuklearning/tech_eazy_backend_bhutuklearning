// vendorModel.js
// Vendor model using Sequelize, with ENUM for subscriptionType and one-to-many relation to DeliveryOrder

import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../parcel/parcelModel.js'; // Reuse the same sequelize instance (same DB)


// // Vendor model definition
// export const Vendor = sequelize.define('Vendor', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   vendorName: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   },
//   subscriptionType: {
//     type: DataTypes.ENUM('NORMAL', 'PRIME', 'VIP'),
//     allowNull: false,
//     defaultValue: 'NORMAL'
//   }
// }, {
//   timestamps: true
// });

export const Vendor = sequelize.define('Vendor', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  // Business identity
  vendorName: { type: DataTypes.STRING, allowNull: false, unique: true },
  subscriptionType: {
    type: DataTypes.ENUM('NORMAL', 'PRIME', 'VIP'),
    allowNull: false,
    defaultValue: 'NORMAL'
  },

  // 🔐 Auth fields for vendor login
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false } // store bcrypt hash
}, {
  timestamps: true
});



// DeliveryOrder model will be associated in its own file

export default Vendor;