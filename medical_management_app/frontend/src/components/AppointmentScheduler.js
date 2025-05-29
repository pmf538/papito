// src/components/AppointmentScheduler.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AppointmentScheduler() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '', // Will be a dropdown or search in the future
    date_heure_rdv: '',
    motif_rdv: ''
  });
  const [message, setMessage] = useState('');
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    axios.get('/api/doctors')
      .then(response => {
        setDoctors(response.data.data || response.data); // Adjust if backend wraps in 'data'
        if ((response.data.data || response.data).length > 0) {
          // Set default doctor_id if doctors are available
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
    if (!formData.patient_id || !formData.doctor_id || !formData.date_heure_rdv) {
      setMessage('Patient ID, Doctor ID, and Date/Time are required.');
      return;
    }
    try {
      // Backend expects doctor_id, patient_id as integers
      const payload = {
        ...formData,
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
      };
      const response = await axios.post('/api/appointments', payload);
      setMessage(response.data.message || 'Appointment scheduled successfully!');
      setFormData({ 
        patient_id: '', 
        doctor_id: doctors.length > 0 ? doctors[0].id : '', // Reset to first doctor or empty
        date_heure_rdv: '', 
        motif_rdv: '' 
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error scheduling appointment.');
    }
  };

  return (
    <div>
      <h2>Schedule New Appointment</h2>
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
          <label htmlFor="date_heure_rdv">Date and Time:</label>
          <input type="datetime-local" name="date_heure_rdv" value={formData.date_heure_rdv} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="motif_rdv">Reason for Visit:</label>
          <textarea name="motif_rdv" value={formData.motif_rdv} onChange={handleChange}></textarea>
        </div>
        <button type="submit" disabled={loadingDoctors || doctors.length === 0}>Schedule Appointment</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AppointmentScheduler;
