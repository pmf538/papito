// src/components/AddDoctor.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddDoctor() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    specialisation: '',
    email: '',
    telephone: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!formData.nom || !formData.prenom || !formData.email) {
      setMessage('Last Name, First Name, and Email are required.');
      return;
    }
    try {
      const response = await axios.post('/api/doctors', formData);
      setMessage(response.data.message || 'Doctor added successfully!');
      setFormData({ nom: '', prenom: '', specialisation: '', email: '', telephone: '' });
      setTimeout(() => navigate('/doctors'), 1500); // Navigate back to list after delay
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.details || 'Error adding doctor.');
    }
  };

  return (
    <div>
      <h2>Add New Doctor</h2>
      <form onSubmit={handleSubmit}>
        <div><label>Last Name: <input type="text" name="nom" value={formData.nom} onChange={handleChange} required /></label></div>
        <div><label>First Name: <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required /></label></div>
        <div><label>Specialization: <input type="text" name="specialisation" value={formData.specialisation} onChange={handleChange} /></label></div>
        <div><label>Email: <input type="email" name="email" value={formData.email} onChange={handleChange} required /></label></div>
        <div><label>Phone: <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} /></label></div>
        <button type="submit">Add Doctor</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
export default AddDoctor;
