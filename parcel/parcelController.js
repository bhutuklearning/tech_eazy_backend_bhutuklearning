import express from 'express';
import {
    getAllParcels,
    getParcelByTrackingId,
    createParcel,
    updateParcel,
    deleteParcel
} from './parcelService.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const parcels = await getAllParcels();
    res.json(parcels);
});

router.get('/:trackingId', async (req, res) => {
    const parcel = await getParcelByTrackingId(req.params.trackingId);
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

router.put('/:trackingId', async (req, res) => {
    const parcel = await updateParcel(req.params.trackingId, req.body);
    if (!parcel) return res.status(404).json({ error: 'Parcel not found' });
    res.json(parcel);
});

router.delete('/:trackingId', async (req, res) => {
    const parcel = await deleteParcel(req.params.trackingId);
    if (!parcel) return res.status(404).json({ error: 'Parcel not found' });
    res.json({ message: 'Parcel deleted' });
});

export default router;