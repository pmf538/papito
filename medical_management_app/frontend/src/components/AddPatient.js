// src/components/AddPatient.js
import React, { useState } from 'react';
import axios from 'axios';

function AddPatient() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    adresse: '',
    telephone: '',
    email: '',
    historique_medical: ''
  });
  const [message, setMessage] = useState(null); // For success/error messages
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setIsError(false);

    // Basic client-side validation
    if (!formData.nom || !formData.prenom) {
      setMessage('Last name and First name are required.');
      setIsError(true);
      return;
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        setMessage('Please enter a valid email address.');
        setIsError(true);
        return;
    }
    if (formData.date_naissance && !/^\d{4}-\d{2}-\d{2}$/.test(formData.date_naissance)) {
        setMessage('Date of birth must be in YYYY-MM-DD format.');
        setIsError(true);
        return;
    }


    try {
      const response = await axios.post('/api/patients', formData);
      setMessage(response.data.message || 'Patient added successfully!');
      setIsError(false);
      // Clear form after successful submission
      setFormData({
        nom: '',
        prenom: '',
        date_naissance: '',
        adresse: '',
        telephone: '',
        email: '',
        historique_medical: ''
      });
    } catch (error) {
      console.error('Error adding patient:', error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.details || error.response.data.error || 'Failed to add patient.');
      } else {
        setMessage('Failed to add patient. Check console for details.');
      }
      setIsError(true);
    }
  };

  return (
    <div>
      <h2>Add New Patient</h2>
      {message && (
        <p style={{ color: isError ? 'red' : 'green' }}>{message}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nom">Last Name: *</label>
          <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="prenom">First Name: *</label>
          <input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="date_naissance">Date of Birth (YYYY-MM-DD):</label>
          <input type="text" id="date_naissance" name="date_naissance" value={formData.date_naissance} onChange={handleChange} placeholder="YYYY-MM-DD" />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="telephone">Phone:</label>
          <input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="adresse">Address:</label>
          <textarea id="adresse" name="adresse" value={formData.adresse} onChange={handleChange}></textarea>
        </div>
        <div>
          <label htmlFor="historique_medical">Medical History:</label>
          <textarea id="historique_medical" name="historique_medical" value={formData.historique_medical} onChange={handleChange}></textarea>
        </div>
        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
}

export default AddPatient;
