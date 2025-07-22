import { Parcel } from './parcelModel.js';

export const getAllParcels = async () => {
    return await Parcel.findAll();
};

export const getParcelByTrackingId = async (trackingId) => {
    return await Parcel.findOne({ where: { trackingId } });
};

export const createParcel = async (data) => {
    return await Parcel.create(data);
};

export const updateParcel = async (trackingId, data) => {
    const parcel = await Parcel.findOne({ where: { trackingId } });
    if (!parcel) return null;
    await parcel.update(data);
    return parcel;
};

export const deleteParcel = async (trackingId) => {
    const parcel = await Parcel.findOne({ where: { trackingId } });
    if (!parcel) return null;
    await parcel.destroy();
    return parcel;
};