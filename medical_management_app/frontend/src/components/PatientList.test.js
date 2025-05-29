import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import PatientList from './PatientList';
import { BrowserRouter as Router } from 'react-router-dom'; // Needed if Link is used

// Mock axios
jest.mock('axios');

describe('PatientList Component', () => {
  beforeEach(() => {
    // Reset any previous mock implementation details
    axios.get.mockReset();
  });

  test('renders without crashing', () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } }); // Mock for initial load
    render(<Router><PatientList /></Router>);
    expect(screen.getByText(/Patient List/i)).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } }); // Mock a slow response
    render(<Router><PatientList /></Router>);
    expect(screen.getByText(/Loading patients.../i)).toBeInTheDocument();
  });

  test('displays patient data after successful fetch', async () => {
    const mockPatients = [
      { id: 1, prenom: 'Alice', nom: 'Wonderland', email: 'alice@example.com', date_naissance: '1990-01-01', telephone: '123' },
      { id: 2, prenom: 'Bob', nom: 'Builder', email: 'bob@example.com', date_naissance: '1985-05-05', telephone: '456' },
    ];
    axios.get.mockResolvedValueOnce({ data: { data: mockPatients } });

    render(<Router><PatientList /></Router>);

    // Wait for loading to disappear and data to appear
    await waitFor(() => expect(screen.queryByText(/Loading patients.../i)).not.toBeInTheDocument());
    
    // Check for parts of patient info. PatientList renders "prenom nom" together.
    expect(screen.getByText(/Alice Wonderland/i)).toBeInTheDocument();
    expect(screen.getByText(/bob@example.com/i)).toBeInTheDocument(); // Email is a good unique identifier here
  });

  test('displays error message on API error', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));
    render(<Router><PatientList /></Router>);

    await waitFor(() => expect(screen.queryByText(/Loading patients.../i)).not.toBeInTheDocument());
    
    // The error message in PatientList.js is "Error loading patients: {error}"
    // So we check for the generic part and then the specific message if needed
    expect(screen.getByText(/Error loading patients:/i)).toBeInTheDocument();
    // The actual error message 'Network Error' is part of the error object and displayed.
    expect(screen.getByText(/Network Error/i)).toBeInTheDocument(); 
  });

  test('displays "No patients found" when API returns empty list', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
    render(<Router><PatientList /></Router>);

    await waitFor(() => expect(screen.queryByText(/Loading patients.../i)).not.toBeInTheDocument());
    expect(screen.getByText(/No patients found./i)).toBeInTheDocument();
  });
});
