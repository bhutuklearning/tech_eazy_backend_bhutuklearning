// deliveryOrderModel.js
// DeliveryOrder model using Sequelize, with relation to Vendor

import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../parcel/parcelModel.js'; // Reuse the same sequelize instance (same DB)
import { Vendor } from '../vendor/vendorModel.js';

// If there was previous code, it would be commented out here.

// DeliveryOrder model definition
export const DeliveryOrder = sequelize.define('DeliveryOrder', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vendor,
      key: 'id'
    }
  },
  deliveryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  subscriptionType: {
    type: DataTypes.ENUM('NORMAL', 'PRIME', 'VIP'),
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

// Set up the one-to-many relationship
Vendor.hasMany(DeliveryOrder, { foreignKey: 'vendorId' });
DeliveryOrder.belongsTo(Vendor, { foreignKey: 'vendorId' });

export default DeliveryOrder;