// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PatientList from './components/PatientList';
import AddPatient from './components/AddPatient';
import AppointmentScheduler from './components/AppointmentScheduler';
import PrescriptionManager from './components/PrescriptionManager';
import DoctorList from './components/DoctorList';
import AddDoctor from './components/AddDoctor';
import DoctorSchedule from './components/DoctorSchedule'; // Import DoctorSchedule
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home (Patient List)</Link>
            </li>
            <li>
              <Link to="/add-patient">Add Patient</Link>
            </li>
            <li>
              <Link to="/schedule-appointment">Schedule Appointment</Link>
            </li>
            <li>
              <Link to="/manage-prescriptions">Manage Prescriptions</Link>
            </li>
            <li>
              <Link to="/doctors">Doctors</Link>
            </li>
          </ul>
        </nav>
        <hr />
        <Routes>
          <Route path="/" element={<PatientList />} />
          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/schedule-appointment" element={<AppointmentScheduler />} />
          <Route path="/manage-prescriptions" element={<PrescriptionManager />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctors/:doctorId/schedule" element={<DoctorSchedule />} /> {/* New Route for DoctorSchedule */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
