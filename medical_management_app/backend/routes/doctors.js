const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection pool

// POST /api/doctors - Create a new doctor
router.post('/', async (req, res) => {
  try {
    const { nom, prenom, specialisation, email, telephone } = req.body;

    // Basic validation
    if (!nom || !prenom || !email) {
      return res.status(400).json({ message: 'Nom (Last name), Prenom (First name), and Email are required fields.' });
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    const [result] = await db.query(
      'INSERT INTO doctors (nom, prenom, specialisation, email, telephone) VALUES (?, ?, ?, ?, ?)',
      [nom, prenom, specialisation || null, email, telephone || null]
    );
    const newDoctorId = result.insertId;
    res.status(201).json({ message: "Successfully created a new doctor", data: { id: newDoctorId, ...req.body } });
  } catch (error) {
    console.error('Error creating doctor:', error);
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Failed to create doctor', details: 'Email already exists.' });
    }
    res.status(500).json({ error: 'Failed to create doctor', details: error.message });
  }
});

// GET /api/doctors - Get all doctors
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nom, prenom, specialisation, email, telephone FROM doctors');
    res.json({ message: "Successfully fetched all doctors", data: rows });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors', details: error.message });
  }
});

// GET /api/doctors/:id - Get a specific doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT id, nom, prenom, specialisation, email, telephone FROM doctors WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: `Successfully fetched doctor with ID ${id}`, data: rows[0] });
  } catch (error) {
    console.error(`Error fetching doctor with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch doctor', details: error.message });
  }
});

// POST /api/doctors/:doctorId/schedule - Add/Update a schedule entry for a doctor
router.post('/:doctorId/schedule', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { jour_semaine, heure_debut, heure_fin, notes } = req.body;

    if (!jour_semaine || !heure_debut || !heure_fin) {
      return res.status(400).json({ message: 'Jour de la semaine, heure de début, and heure de fin are required.' });
    }

    // Check if doctor exists
    const [doctorRows] = await db.query('SELECT id FROM doctors WHERE id = ?', [doctorId]);
    if (doctorRows.length === 0) {
      return res.status(404).json({ message: `Doctor with ID ${doctorId} not found.` });
    }

    // Using INSERT ... ON DUPLICATE KEY UPDATE for add/update logic
    // This relies on the UNIQUE KEY (doctor_id, jour_semaine, heure_debut) in doctor_schedules
    const sql = `
      INSERT INTO doctor_schedules (doctor_id, jour_semaine, heure_debut, heure_fin, notes)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        heure_fin = VALUES(heure_fin),
        notes = VALUES(notes),
        date_modification = CURRENT_TIMESTAMP
    `;
    const [result] = await db.query(sql, [doctorId, jour_semaine, heure_debut, heure_fin, notes || null]);

    if (result.insertId > 0) {
        res.status(201).json({ message: "Successfully created schedule entry.", data: { id: result.insertId, doctor_id: doctorId, ...req.body } });
    } else if (result.affectedRows > 0) {
        // If affectedRows > 0 and insertId is 0, it means an update occurred.
        // We might need to fetch the ID if it's an update and the ID is not returned directly.
        // For simplicity, we'll just send a success message.
        res.status(200).json({ message: "Successfully updated schedule entry.", data: { doctor_id: doctorId, ...req.body } });
    } else {
        // Should not happen if doctor_id is valid and data is provided
        res.status(400).json({ message: "Could not create or update schedule entry." });
    }

  } catch (error) {
    console.error(`Error adding/updating schedule for doctor ID ${req.params.doctorId}:`, error);
    if (error.code === 'ER_DUP_ENTRY' || error.code === 'ER_NO_REFERENCED_ROW_2') { // ER_NO_REFERENCED_ROW_2 for FK violation
        return res.status(400).json({ error: 'Failed to add/update schedule', details: 'Invalid doctor ID or duplicate schedule entry for the same start time.' });
    }
    res.status(500).json({ error: 'Failed to add/update schedule', details: error.message });
  }
});

// GET /api/doctors/:doctorId/schedule - Get all schedule entries for a doctor
router.get('/:doctorId/schedule', async (req, res) => {
  try {
    const { doctorId } = req.params;
    // Check if doctor exists
    const [doctorRows] = await db.query('SELECT id FROM doctors WHERE id = ?', [doctorId]);
    if (doctorRows.length === 0) {
      return res.status(404).json({ message: `Doctor with ID ${doctorId} not found.` });
    }

    const [rows] = await db.query('SELECT id, jour_semaine, heure_debut, heure_fin, notes FROM doctor_schedules WHERE doctor_id = ? ORDER BY FIELD(jour_semaine, "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"), heure_debut', [doctorId]);
    res.json({ message: `Successfully fetched schedule for doctor ID ${doctorId}`, data: rows });
  } catch (error) {
    console.error(`Error fetching schedule for doctor ID ${req.params.doctorId}:`, error);
    res.status(500).json({ error: 'Failed to fetch schedule', details: error.message });
  }
});

// DELETE /api/doctors/:doctorId/schedule/:scheduleId - Delete a specific schedule entry
router.delete('/:doctorId/schedule/:scheduleId', async (req, res) => {
  try {
    const { doctorId, scheduleId } = req.params;

    // Check if doctor exists (optional, but good for clear errors)
    const [doctorRows] = await db.query('SELECT id FROM doctors WHERE id = ?', [doctorId]);
    if (doctorRows.length === 0) {
      return res.status(404).json({ message: `Doctor with ID ${doctorId} not found.` });
    }

    const [result] = await db.query('DELETE FROM doctor_schedules WHERE id = ? AND doctor_id = ?', [scheduleId, doctorId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Schedule entry with ID ${scheduleId} for doctor ID ${doctorId} not found, or already deleted.` });
    }
    res.json({ message: `Successfully deleted schedule entry with ID ${scheduleId}` });
  } catch (error) {
    console.error(`Error deleting schedule entry ID ${req.params.scheduleId}:`, error);
    res.status(500).json({ error: 'Failed to delete schedule entry', details: error.message });
  }
});

module.exports = router;
