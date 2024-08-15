import express from 'express';
import { Ward, Patient } from '../models/WholeSchema.js';
const router = express.Router();

// GET /wards - Retrieve all wards
router.get('/', async (req, res) => {
  try {
    const wards = await Ward.find();
    res.json(wards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /wards/create - Create a new ward
router.post('/create', async (req, res) => {
  try {
    const { ward_name } = req.body;

    // Create a new Ward instance
    const newWard = new Ward({
      ward_name,
      created_at: new Date(),
    });

    const savedWard = await newWard.save();

    res.status(201).json(savedWard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /wards/:id - Retrieve a specific ward by ID
router.get('/:id', async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);
    if (!ward) {
      return res.status(404).json({ message: 'Ward not found' });
    }
    res.json(ward);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /wards/:id - Update a specific ward by ID
router.put('/:id', async (req, res) => {
  try {
    const { ward_name } = req.body;
    const ward = await Ward.findById(req.params.id);
    if (!ward) {
      return res.status(404).json({ message: 'Ward not found' });
    }
    if (ward_name) {
      ward.ward_name = ward_name;
    }
    const updatedWard = await ward.save();
    res.json(updatedWard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /wards/:id - Delete a specific ward by ID
router.delete('/:id', async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);
    if (!ward) {
      return res.status(404).json({ message: 'Ward not found' });
    }
    await ward.deleteOne();
    res.json({ message: 'Ward deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /wards/:id/patients - Retrieve patients in a specific ward
router.get('/:id/patients', async (req, res) => {
  try {
    const wardId = req.params.id;

    // Find all patients in the specified ward
    const patients = await Patient.find({ ward_id: wardId });

    if (patients.length === 0) {
      return res.status(404).json({ message: 'No patients found in this ward' });
    }

    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as wardRoutes };
