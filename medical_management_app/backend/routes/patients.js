const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection pool

// GET all patients
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nom, prenom, date_naissance, adresse, telephone, email, DATE_FORMAT(date_creation, "%Y-%m-%dT%TZ") as date_creation, DATE_FORMAT(date_modification, "%Y-%m-%dT%TZ") as date_modification FROM patients');
    res.json({ message: "Successfully fetched all patients", data: rows });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients', details: error.message });
  }
});

// GET a single patient by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT id, nom, prenom, date_naissance, adresse, telephone, email, DATE_FORMAT(date_creation, "%Y-%m-%dT%TZ") as date_creation, DATE_FORMAT(date_modification, "%Y-%m-%dT%TZ") as date_modification FROM patients WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: `Successfully fetched patient with ID ${id}`, data: rows[0] });
  } catch (error) {
    console.error(`Error fetching patient with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch patient', details: error.message });
  }
});

// POST a new patient
// express.json() middleware is already applied in index.js, so no need to apply it here again.
router.post('/', async (req, res) => {
  try {
    const { nom, prenom, date_naissance, adresse, telephone, email, historique_medical } = req.body;

    // Basic validation
    if (!nom || !prenom) {
      return res.status(400).json({ message: 'Nom (Last name) and Prenom (First name) are required fields.' });
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }
    if (date_naissance && !/^\d{4}-\d{2}-\d{2}$/.test(date_naissance)) {
        return res.status(400).json({ message: 'Invalid date_naissance format. Please use YYYY-MM-DD.' });
    }


    const [result] = await db.query(
      'INSERT INTO patients (nom, prenom, date_naissance, adresse, telephone, email, historique_medical) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, prenom, date_naissance || null, adresse || null, telephone || null, email || null, historique_medical || null]
    );
    const newPatientId = result.insertId;
    res.status(201).json({ message: "Successfully created a new patient", data: { id: newPatientId, ...req.body } });
  } catch (error) {
    console.error('Error creating patient:', error);
    // Check for unique constraint violation (e.g., duplicate email)
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Failed to create patient', details: 'Email already exists.' });
    }
    res.status(500).json({ error: 'Failed to create patient', details: error.message });
  }
});

module.exports = router;
