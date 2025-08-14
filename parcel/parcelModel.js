import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/parcel_assignment2.db'
});

export const Parcel = sequelize.define('Parcel', {
    trackingNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parcelSize: {
        type: DataTypes.STRING,
        allowNull: false
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: true
});

export default sequelize;