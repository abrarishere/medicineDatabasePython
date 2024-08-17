import express from 'express';
import { PatientMedicine } from '../models/WholeSchema.js';
const router = express.Router();

// GET /patient-medicines - Retrieve all patient medicines
router.get('/', async (req, res) => {
  try {
    const patientMedicines = await PatientMedicine.find();
    res.json(patientMedicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /patient-medicines/create - Create a new patient medicine entry
router.post('/create', async (req, res) => {
  try {
    const { mr_number, medicine_id, quantity, date } = req.body;

    const newPatientMedicine = new PatientMedicine({
      mr_number,
      medicine_id,
      quantity,
      date: date || new Date(), // Use the provided date or default to the current date
    });

    const savedPatientMedicine = await newPatientMedicine.save();

    res.status(201).json(savedPatientMedicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /patient-medicines/:id - Retrieve a specific patient medicine entry by ID
router.get('/:id', async (req, res) => {
  try {
    const patientMedicine = await PatientMedicine.findById(req.params.id);
    if (!patientMedicine) {
      return res.status(404).json({ message: 'PatientMedicine not found' });
    }
    res.json(patientMedicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /patient-medicines/:id - Update a specific patient medicine entry by ID
router.put('/:id', async (req, res) => {
  try {
    const { mr_number, medicine_id, quantity, date } = req.body;
    const patientMedicine = await PatientMedicine.findById(req.params.id);
    if (!patientMedicine) {
      return res.status(404).json({ message: 'PatientMedicine not found' });
    }

    // Update the fields if they are provided in the request body
    if (mr_number) patientMedicine.mr_number = mr_number;
    if (medicine_id) patientMedicine.medicine_id = medicine_id;
    if (quantity) patientMedicine.quantity = quantity;
    if (date) patientMedicine.date = date;

    const updatedPatientMedicine = await patientMedicine.save();
    res.json(updatedPatientMedicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /patient-medicines/:id - Delete a specific patient medicine entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const patientMedicine = await PatientMedicine.findById(req.params.id);
    if (!patientMedicine) {
      return res.status(404).json({ message: 'PatientMedicine not found' });
    }
    await patientMedicine.deleteOne();
    res.json({ message: 'PatientMedicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get Patient Medicine by MR Number
router.get('/mr/:mr_number', async (req, res) => {
  try {
    const patientMedicine = await PatientMedicine.find({ mr_number: req.params.mr_number });
    if (!patientMedicine) {
      return res.status(404).json({ message: 'PatientMedicine not found' });
    }
    res.json(patientMedicine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as patientMedicineRoutes };
