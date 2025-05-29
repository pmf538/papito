const request = require('supertest');
const app = require('../index'); // Path to the app exported from index.js (or app.js)
const db = require('../db'); // For direct DB manipulation or cleanup if needed

describe('Patient API Endpoints', () => {
  let createdPatientId;

  // Optional: Clear test data before or after tests
  afterAll(async () => {
    if (createdPatientId) {
      try {
        await db.query('DELETE FROM patients WHERE id = ?', [createdPatientId]);
        console.log(`Cleaned up patient with ID: ${createdPatientId}`);
      } catch (error) {
        console.error(`Error cleaning up patient ID ${createdPatientId}:`, error.message);
      }
    }
    // Close the pool after all tests in this file are done
    // This is important if jest.config.js's forceExit is not used or if you want finer control
    await db.end(); 
  });

  it('should fetch all patients', async () => {
    const res = await request(app).get('/api/patients');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data'); // Check if 'data' property exists
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should create a new patient', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/patients')
      .send({
        nom: 'Test',
        prenom: 'Patient',
        email: uniqueEmail,
        date_naissance: '1990-01-01',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('id');
    createdPatientId = res.body.data.id; // Save for later tests
  });

  it('should fail to create a patient with missing required fields (nom)', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({
        prenom: 'PatientOnly',
        email: `test-fail-nom-${Date.now()}@example.com`,
      });
    expect(res.statusCode).toEqual(400); 
    expect(res.body.message).toEqual('Nom (Last name) and Prenom (First name) are required fields.');
  });

  it('should fail to create a patient with missing required fields (prenom)', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({
        nom: 'TestOnly',
        email: `test-fail-prenom-${Date.now()}@example.com`,
      });
    expect(res.statusCode).toEqual(400); 
    expect(res.body.message).toEqual('Nom (Last name) and Prenom (First name) are required fields.');
  });
  
  it('should fetch a specific patient by ID', async () => {
    if (!createdPatientId) {
        // This might happen if the "create new patient" test failed.
        // To make this test independent, we could create a patient here.
        // For now, we'll rely on the previous test or skip.
        console.warn("Skipping test for fetching specific patient as no ID was created in the previous test.");
        // You can throw an error to fail the test explicitly or return to skip
        // throw new Error("createdPatientId is not set, cannot run test 'should fetch a specific patient by ID'");
        return; 
    }
    const res = await request(app).get(`/api/patients/${createdPatientId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('id', createdPatientId);
  });

  it('should return 404 for a non-existent patient ID', async () => {
    const res = await request(app).get('/api/patients/999999'); // A very unlikely ID
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Patient not found');
  });

  it('should fail to create a patient with a duplicate email', async () => {
    const uniqueEmail = `duplicate-${Date.now()}@example.com`;
    // First, create a patient
    await request(app)
      .post('/api/patients')
      .send({
        nom: 'Duplicate',
        prenom: 'Test',
        email: uniqueEmail,
        date_naissance: '1990-01-01',
      });
    
    // Then, try to create another patient with the same email
    const res = await request(app)
      .post('/api/patients')
      .send({
        nom: 'Another',
        prenom: 'User',
        email: uniqueEmail, 
        date_naissance: '1991-01-01',
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body.details).toEqual('Email already exists.');
  });
});
