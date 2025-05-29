// src/components/DoctorSchedule.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function DoctorSchedule() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    jour_semaine: 'Lundi',
    heure_debut: '',
    heure_fin: '',
    notes: ''
  });
  const [formMessage, setFormMessage] = useState('');

  const fetchDoctorAndSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const doctorRes = await axios.get(`/api/doctors/${doctorId}`);
      setDoctor(doctorRes.data.data || doctorRes.data);

      const scheduleRes = await axios.get(`/api/doctors/${doctorId}/schedule`);
      setSchedule(scheduleRes.data.data || scheduleRes.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error fetching data");
      setDoctor(null); // Clear doctor info on error too
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchDoctorAndSchedule();
  }, [fetchDoctorAndSchedule]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    setFormMessage('');
    if (!formData.heure_debut || !formData.heure_fin) {
      setFormMessage('Start and End time are required.');
      return;
    }
    try {
      await axios.post(`/api/doctors/${doctorId}/schedule`, formData);
      setFormMessage('Schedule entry added successfully!');
      setFormData({ jour_semaine: 'Lundi', heure_debut: '', heure_fin: '', notes: '' });
      fetchDoctorAndSchedule(); // Refresh schedule
    } catch (err) {
      setFormMessage(err.response?.data?.message || 'Error adding schedule entry.');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule entry?")) return;
    try {
      await axios.delete(`/api/doctors/${doctorId}/schedule/${scheduleId}`);
      setFormMessage('Schedule entry deleted successfully!');
      fetchDoctorAndSchedule(); // Refresh schedule
    } catch (err) {
      setFormMessage(err.response?.data?.message || 'Error deleting schedule entry.');
    }
  };

  if (loading) return <p>Loading schedule...</p>;
  if (error) return <p>Error: {error} <Link to="/doctors">Back to Doctors</Link></p>;
  if (!doctor) return <p>Doctor not found. <Link to="/doctors">Back to Doctors</Link></p>;

  return (
    <div>
      <h2>Schedule for Dr. {doctor.prenom} {doctor.nom}</h2>
      <Link to="/doctors">Back to Doctor List</Link>

      <h3>Add New Schedule Entry</h3>
      <form onSubmit={handleAddSchedule}>
        <div>
          <label>Day:
            <select name="jour_semaine" value={formData.jour_semaine} onChange={handleChange}>
              {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </label>
        </div>
        <div><label>Start Time: <input type="time" name="heure_debut" value={formData.heure_debut} onChange={handleChange} required /></label></div>
        <div><label>End Time: <input type="time" name="heure_fin" value={formData.heure_fin} onChange={handleChange} required /></label></div>
        <div><label>Notes: <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea></label></div>
        <button type="submit">Add to Schedule</button>
      </form>
      {formMessage && <p>{formMessage}</p>}

      <h3>Current Schedule</h3>
      {schedule.length === 0 ? (
        <p>No schedule entries found for this doctor.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map(entry => (
              <tr key={entry.id}>
                <td>{entry.jour_semaine}</td>
                <td>{entry.heure_debut}</td>
                <td>{entry.heure_fin}</td>
                <td>{entry.notes}</td>
                <td><button onClick={() => handleDeleteSchedule(entry.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default DoctorSchedule;
