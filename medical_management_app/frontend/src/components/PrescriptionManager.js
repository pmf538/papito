// src/components/PrescriptionManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PrescriptionManager() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    date_prescription: '',
    medicaments: '', // User will input JSON string for now
    instructions_generales: ''
  });
  const [message, setMessage] = useState('');
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  // const [prescriptions, setPrescriptions] = useState([]); // For displaying prescriptions

  useEffect(() => {
    axios.get('/api/doctors')
      .then(response => {
        setDoctors(response.data.data || response.data);
        if ((response.data.data || response.data).length > 0) {
          setFormData(prevFormData => ({
            ...prevFormData,
            doctor_id: (response.data.data || response.data)[0].id
          }));
        }
        setLoadingDoctors(false);
      })
      .catch(err => {
        console.error("Error fetching doctors:", err);
        setMessage('Error fetching doctors list.');
        setLoadingDoctors(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!formData.patient_id || !formData.doctor_id || !formData.date_prescription || !formData.medicaments) {
      setMessage('Patient ID, Doctor ID, Date, and Medications are required.');
      return;
    }
    try {
      let medsJson;
      try {
        medsJson = JSON.parse(formData.medicaments);
      } catch (jsonError) {
        setMessage('Medicaments field must be a valid JSON string. E.g., [{"nom": "Med1", "dosage": "10mg"}]');
        return;
      }
      const payload = {
        ...formData,
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
        medicaments: medsJson
      };
      const response = await axios.post('/api/prescriptions', payload);
      setMessage(response.data.message || 'Prescription created successfully!');
      setFormData({ 
        patient_id: '', 
        doctor_id: doctors.length > 0 ? doctors[0].id : '', 
        date_prescription: '', 
        medicaments: '', 
        instructions_generales: '' 
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating prescription.');
    }
  };
  
  // Basic fetch logic (can be expanded)
  // const fetchPrescriptions = async (patientIdToFetch) => { ... };

  return (
    <div>
      <h2>Create New Prescription</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="patient_id">Patient ID:</label>
          <input type="number" name="patient_id" value={formData.patient_id} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="doctor_id">Doctor:</label>
          {loadingDoctors ? (
            <p>Loading doctors...</p>
          ) : doctors.length === 0 ? (
            <p>No doctors available. Please add doctors first.</p>
          ) : (
            <select name="doctor_id" value={formData.doctor_id} onChange={handleChange} required>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.prenom} {doctor.nom} - {doctor.specialisation || 'Generalist'}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label htmlFor="date_prescription">Date:</label>
          <input type="date" name="date_prescription" value={formData.date_prescription} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="medicaments">Medications (JSON format):</label>
          <textarea name="medicaments" value={formData.medicaments} onChange={handleChange} required rows="3"></textarea>
          <small>E.g., {JSON.stringify([{"nom_medicament": "Amoxicilline", "dosage": "250mg", "posologie": "3/jour"}])}</small>
        </div>
        <div>
          <label htmlFor="instructions_generales">General Instructions:</label>
          <textarea name="instructions_generales" value={formData.instructions_generales} onChange={handleChange}></textarea>
        </div>
        <button type="submit" disabled={loadingDoctors || doctors.length === 0}>Create Prescription</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PrescriptionManager;
