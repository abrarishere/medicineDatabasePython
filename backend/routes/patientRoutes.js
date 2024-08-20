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
    // Find the patient by ID
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Delete all PatientMedicine records related to this patient
    await PatientMedicine.deleteMany({ mr_number: patient.mr_number });

    // Delete the patient
    await patient.deleteOne();

    res.json({ message: 'Patient and related records deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /patients/:id/medicines - Retrieve all medicines for a specific patient
router.get('/:id/medicines', async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the patient by ID
    const patient = await Patient.findById(userId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const mrNumber = patient.mr_number;

    // Find all medicines related to the patient
    const patientMedicines = await PatientMedicine.find({ mr_number: mrNumber });

    if (patientMedicines.length === 0) {
      return res.status(404).json({ message: 'No medicines found for this patient' });
    }

    // Extract unique medicine IDs
    const uniqueMedicineIds = [...new Set(patientMedicines.map(pm => pm.medicine_id.toString()))];

    // Fetch medicine details
    const medicines = await Medicine.find({ _id: { $in: uniqueMedicineIds } });

    if (medicines.length === 0) {
      return res.status(404).json({ message: 'No medicines found' });
    }

    // Create a map of medicine IDs to their quantities
    const medicineQuantities = patientMedicines.reduce((acc, pm) => {
      acc[pm.medicine_id.toString()] = pm.quantity;
      return acc;
    }, {});

    // Update medicine details with quantities
    const updatedMedicines = medicines.map(medicine => ({
      ...medicine.toObject(),
      quantity: medicineQuantities[medicine._id.toString()] || 0
    }));

    res.json(updatedMedicines);
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({ error: error.message });
  }
});

//Get patient by MR Number
router.get('/mr/:mr_number', async (req, res) => {
  try {
    const patient = await Patient.find({ mr_number: req.params.mr_number });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as patientRoutes };
