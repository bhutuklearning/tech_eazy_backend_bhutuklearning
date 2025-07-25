import express from 'express';
import {
    getAllParcels,
    getParcelByTrackingNumber,
    createParcel,
    updateParcel,
    deleteParcel
} from './parcelService.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const parcels = await getAllParcels();
    res.json(parcels);
});

router.get('/:trackingNumber', async (req, res) => {
    const parcel = await getParcelByTrackingNumber(req.params.trackingNumber);
    if (!parcel) return res.status(404).json({ error: 'Parcel not found' });
    res.json(parcel);
});

router.post('/', async (req, res) => {
    try {
        const parcel = await createParcel(req.body);
        res.status(201).json(parcel);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:trackingNumber', async (req, res) => {
    const parcel = await updateParcel(req.params.trackingNumber, req.body);
    if (!parcel) return res.status(404).json({ error: 'Parcel not found' });
    res.json(parcel);
});

router.delete('/:trackingNumber', async (req, res) => {
    const parcel = await deleteParcel(req.params.trackingNumber);
    if (!parcel) return res.status(404).json({ error: 'Parcel not found' });
    res.json({ message: 'Parcel deleted' });
});

export default router;