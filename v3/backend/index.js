import express from 'express';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import { patientRoutes } from './routes/patientRoutes.js';
import { patientMedicineRoutes } from './routes/patientMedicineRoutes.js';
import { medicineRoutes } from './routes/medicineRoutes.js';
import { wardRoutes } from './routes/wardRoutes.js';

configDotenv();
const app = express();
app.use(cors());
app.use(express.json());

// API Key Authentication Middleware
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid API Key' });
  }
};

// Apply API Key Authentication only to specific routes
app.use('/patients', apiKeyAuth, patientRoutes);
app.use('/wards', apiKeyAuth, wardRoutes);
app.use('/medicines', apiKeyAuth, medicineRoutes);

// The /patient-medicines route does not require API key authentication
app.use('/patient-medicines', patientMedicineRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log('Error connecting to MongoDB', error);
});

// Start the Server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}).on('error', (error) => {
  console.log('Error starting server', error);
});
