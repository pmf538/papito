const express = require('express');
// const db = require('./db'); // Import db to initialize connection (optional here, depends on strategy) - db is used in routes
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments'); 
const prescriptionRoutes = require('./routes/prescriptions'); 
const doctorRoutes = require('./routes/doctors'); 

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Mount patient routes
app.use('/api/patients', patientRoutes);
// Mount appointment routes
app.use('/api/appointments', appointmentRoutes);
// Mount prescription routes
app.use('/api/prescriptions', prescriptionRoutes);
// Mount doctor routes
app.use('/api/doctors', doctorRoutes);

module.exports = app;
