// src/components/DoctorList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/doctors')
      .then(response => {
        setDoctors(response.data.data || response.data); // Adjust if backend wraps in 'data'
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p>Error loading doctors: {error}</p>;

  return (
    <div>
      <h2>Doctor List</h2>
      <Link to="/add-doctor">Add New Doctor</Link>
      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Specialization</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor.id}>
                <td>{doctor.id}</td>
                <td>{doctor.prenom}</td>
                <td>{doctor.nom}</td>
                <td>{doctor.specialisation || 'N/A'}</td>
                <td>{doctor.email}</td>
                <td>{doctor.telephone || 'N/A'}</td>
                <td>
                  <Link to={`/doctors/${doctor.id}/schedule`}>Manage Schedule</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default DoctorList;
