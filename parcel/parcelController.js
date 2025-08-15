// import express from 'express';
// import {
//     getAllParcels,
//     getParcelByTrackingNumber,
//     createParcel,
//     updateParcel,
//     deleteParcel
// } from './parcelService.js';
// import { ParcelDTO } from './parcelDTO.js';

// const router = express.Router();

// router.get('/', async (req, res) => {
//     const parcels = await getAllParcels();
//     res.json(parcels);
// });

// router.get('/:trackingNumber', async (req, res) => {
//     const parcel = await getParcelByTrackingNumber(req.params.trackingNumber);
//     if (!parcel) return res.status(404).json({ error: 'Parcel not found' });
//     res.json(parcel);
// });

// router.post('/', async (req, res) => {
//     try {
//         const parcel = await createParcel(req.body);
//         res.status(201).json(parcel);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

// router.put('/:trackingNumber', async (req, res) => {
//     const parcel = await updateParcel(req.params.trackingNumber, req.body);
//     if (!parcel) return res.status(404).json({ error: 'Parcel not found' });
//     res.json(parcel);
// });

// router.delete('/:trackingNumber', async (req, res) => {
//     const parcel = await deleteParcel(req.params.trackingNumber);
//     if (!parcel) return res.status(404).json({ error: 'Parcel not found' });
//     res.json({ message: 'Parcel deleted' });
// });



// /**
//  * DTO-based endpoint for creating a parcel with validation.
//  * POST /parcels/dto
//  */
// router.post('/dto', async (req, res) => {
//     const requiredFields = [
//         'customerName',
//         'deliveryAddress',
//         'trackingNumber',
//         'contactNumber',
//         'parcelSize',
//         'weight'
//     ];
//     // Basic validation
//     for (const field of requiredFields) {
//         if (!req.body[field]) {
//             return res.status(400).json({ error: `Missing required field: ${field}` });
//         }
//     }
//     try {
//         // Use DTO for transformation (could add more logic here)
//         const dto = new ParcelDTO(req.body);
//         // Pass the DTO and other fields to the service
//         const parcel = await createParcel({
//             ...dto,
//             contactNumber: req.body.contactNumber,
//             parcelSize: req.body.parcelSize,
//             weight: req.body.weight
//         });
//         res.status(201).json(parcel);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

// export default router;







// parcelController.js
import express from 'express';
import {
    getAllParcels,
    getParcelByTrackingNumber,
    createParcel,
    updateParcel,
    deleteParcel
} from './parcelService.js';
import { ParcelDTO } from './parcelDTO.js';
import { authenticateJWT } from '../auth/authMiddleware.js';
import { authorizeRole } from '../auth/roleMiddleware.js';

const router = express.Router();

/**
 * Public API - Get parcel by tracking number (no auth)
 * GET /parcels/public/:trackingNumber
 */
router.get('/public/:trackingNumber', async (req, res) => {
    const parcel = await getParcelByTrackingNumber(req.params.trackingNumber);
    if (!parcel) return res.status(404).json({ error: 'Parcel not found' });
    res.json(parcel);
});

// Protect all other parcel routes with Admin role
router.use(authenticateJWT, authorizeRole(['Admin']));

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

/**
 * DTO-based endpoint for creating a parcel with validation.
 * POST /parcels/dto
 */
router.post('/dto', async (req, res) => {
    const requiredFields = [
        'customerName',
        'deliveryAddress',
        'trackingNumber',
        'contactNumber',
        'parcelSize',
        'weight'
    ];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ error: `Missing required field: ${field}` });
        }
    }
    try {
        const dto = new ParcelDTO(req.body);
        const parcel = await createParcel({
            ...dto,
            contactNumber: req.body.contactNumber,
            parcelSize: req.body.parcelSize,
            weight: req.body.weight
        });
        res.status(201).json(parcel);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
