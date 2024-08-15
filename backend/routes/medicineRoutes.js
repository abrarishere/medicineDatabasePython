import express from 'express';
import { Medicine, Patient, PatientMedicine } from '../models/WholeSchema.js';
const router = express.Router();

// GET /medicines - Retrieve all medicines
router.get('/', async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /medicines/create - Create a new medicine
router.post('/create', async (req, res) => {
    try {
        const { medicine_name, quantity } = req.body;

        // Create a new Medicine instance
        const newMedicine = new Medicine({
            medicine_name,
            quantity
        });

        const savedMedicine = await newMedicine.save();

        res.status(201).json(savedMedicine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /medicines/:id - Retrieve a specific medicine by ID
router.get('/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /medicines/:id - Update a specific medicine by ID
router.put('/:id', async (req, res) => {
    try {
        const { medicine_name, quantity } = req.body;
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        if (medicine_name) {
            medicine.medicine_name = medicine_name;
        }
        if (quantity) {
            medicine.quantity = quantity;
        }
        const updatedMedicine = await medicine.save();
        res.json(updatedMedicine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /medicines/:id - Delete a specific medicine by ID
router.delete('/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        await medicine.deleteOne();
        res.json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /medicines/:id/patients - Retrieve patients using a specific medicine
router.get('/:id/patients', async (req, res) => {
    try {
        const medicineId = req.params.id;

        // Find all PatientMedicine entries with the specified medicine_id
        // const patientMedicines = await PatientMedicine.find({ medicine_id: medicineId }).populate('mr_number');
    // mr nunber is tring not object
        const patientMedicines = await PatientMedicine.find({ medicine_id: medicineId });

        if (patientMedicines.length === 0) {
            return res.status(404).json({ message: 'No patients found using this medicine' });
        }

        // Extract MR numbers from the found entries
        const mrNumbers = patientMedicines.map(pm => pm.mr_number);

        // Find all patients with these MR numbers
        const patients = await Patient.find({ mr_number: { $in: mrNumbers } });

        if (patients.length === 0) {
            return res.status(404).json({ message: 'No patients found' });
        }

        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: error.message });
    }
});

export { router as medicineRoutes };
