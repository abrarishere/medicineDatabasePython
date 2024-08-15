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

app.use('/patients', patientRoutes);
app.use('/patient-medicines', patientMedicineRoutes);
app.use('/wards', wardRoutes); // Added the missing '/' at the beginning
app.use('/medicines', medicineRoutes); // Added the missing '/' at the beginning

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log('Error connecting to MongoDB', error);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}).on('error', (error) => {
  console.log('Error starting server', error);
});
