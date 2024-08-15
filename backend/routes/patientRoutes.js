import express from 'express';
import { Medicine, Patient, PatientMedicine } from '../models/WholeSchema.js';
const router = express.Router();

// GET /patients - Retrieve all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /patients/create - Create a new patient
router.post('/create', async (req, res) => {
  try {
    const { mr_number, name, father_name, gender, age, ward_id, phone_number } = req.body;

    if (mr_number === '') {
      mr_number = Math.floor(Math.random() * 1000026);
    }
    // Create a new Patient instance
    const newPatient = new Patient({
      mr_number,
      name,
      father_name,
      gender,
      age,
      ward_id,
      phone_number,
      created_at: new Date(),
      updated_at: new Date()
    });

    const savedPatient = await newPatient.save();

    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /patients/:id - Retrieve a specific patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /patients/:id - Update a specific patient by ID
router.put('/:id', async (req, res) => {
  try {
    const { mr_number, name, father_name, gender, age, ward_id, phone_number } = req.body;
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update the fields if they are provided in the request body
    if (mr_number) patient.mr_number = mr_number;
    if (name) patient.name = name;
    if (father_name) patient.father_name = father_name;
    if (gender) patient.gender = gender;
    if (age) patient.age = age;
    if (ward_id) patient.ward_id = ward_id;
    if (phone_number) patient.phone_number = phone_number;

    patient.updated_at = new Date(); // Update the timestamp

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /patients/:id - Delete a specific patient by ID
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    await patient.deleteOne();
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /patients/:id/medicines - Retrieve all medicines for a specific patient
router.get('/:id/medicines', async (req, res) => {
  try {
    const patientId = req.params.id;

    // Find all PatientMedicine entries for the specified patient
    const patientMedicines = await PatientMedicine.find({ mr_number: patientId }).populate('medicine_id');

    if (patientMedicines.length === 0) {
      return res.status(404).json({ message: 'No medicines found for this patient' });
    }

    // Extract medicines details from PatientMedicine
    const medicines = patientMedicines.map(pm => ({
      medicine: pm.medicine_id,
      quantity: pm.quantity,
      date: pm.date
    }));

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as patientRoutes };
