// src/components/PatientList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/patients') // API call
      .then(response => {
        if (response.data && response.data.data) {
          setPatients(response.data.data); // Access response.data.data
        } else {
          setPatients([]); // Handle case where data might be missing but request succeeded
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching patients:", err);
        setError(err.message || 'Failed to fetch patients. Please check network or backend server.');
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once on mount

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p>Error loading patients: {error}</p>;

  return (
    <div>
      <h2>Patient List</h2>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.prenom}</td>
                <td>{patient.nom}</td>
                <td>{patient.email || 'N/A'}</td>
                <td>{patient.date_naissance ? new Date(patient.date_naissance).toLocaleDateString() : 'N/A'}</td>
                <td>{patient.telephone || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PatientList;
