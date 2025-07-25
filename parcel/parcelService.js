import { Parcel } from './parcelModel.js';

export const getAllParcels = async () => {
    return await Parcel.findAll();
};

export const getParcelByTrackingNumber = async (trackingNumber) => {
    return await Parcel.findOne({ where: { trackingNumber } });
};

export const createParcel = async (data) => {
    return await Parcel.create(data);
};

export const updateParcel = async (trackingNumber, data) => {
    const parcel = await Parcel.findOne({ where: { trackingNumber } });
    if (!parcel) return null;
    await parcel.update(data);
    return parcel;
};

export const deleteParcel = async (trackingNumber) => {
    const parcel = await Parcel.findOne({ where: { trackingNumber } });
    if (!parcel) return null;
    await parcel.destroy();
    return parcel;
};