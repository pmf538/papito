# Medical Management App - Backend

## Description

This is the backend service for the Medical Management Application. It's a Node.js and Express.js API responsible for managing patient data, appointments, prescriptions, doctor information, and doctor schedules. It interacts with a MySQL database to store and retrieve information.

## Prerequisites

*   **Node.js**: Version 16+ is recommended (current environment uses v18.x).
*   **npm**: Should be installed with Node.js (current environment uses v9.x). (Yarn can also be used).
*   **MySQL Server**: A running MySQL server instance (e.g., local, Docker, or cloud-based).
*   **Database Setup**:
    *   The database `medical_app_db` must be created on your MySQL server.
    *   The necessary tables and relationships must be set up by executing the SQL scripts in the following order:
        1.  `schema.sql` (located in `medical_management_app/schema.sql` - this sets up the initial database and patients table)
        2.  `schema_updates_1.sql` (located in `medical_management_app/backend/schema_updates_1.sql` - adds appointments and prescriptions tables)
        3.  `schema_updates_2.sql` (located in `medical_management_app/backend/schema_updates_2.sql` - adds doctors and doctor_schedules tables, and updates foreign keys)

## Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd medical_management_app/backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
    (or if you prefer yarn: `yarn install`)

3.  **Configure Database Connection:**
    *   The database connection details are located in `db.js`.
    *   You may need to update the following fields in the `pool` configuration to match your MySQL setup:
        *   `host`: (e.g., 'localhost', '127.0.0.1', or your DB host)
        *   `user`: (your MySQL username, e.g., 'root')
        *   `password`: (your MySQL password)
        *   `database`: (should be 'medical_app_db' as per setup instructions)

## Running the Application

1.  **Start the server:**
    ```bash
    npm start
    ```
    This command runs `node server.js`.
2.  The application will start, and by default, it listens on port `3001`. You should see a message like: `Server listening at http://localhost:3001`.

## Running Tests

1.  **Execute the test suite:**
    ```bash
    npm test
    ```
    This command runs Jest tests defined in the `__tests__` directory. Ensure your database (or a test database/mocking strategy) is correctly configured for tests that interact with the database, otherwise some tests might fail (e.g., due to connection errors).

## API Endpoints Summary

Here's a summary of the main API endpoints available:

### Patients
*   `GET /api/patients`: Fetches a list of all patients.
*   `POST /api/patients`: Creates a new patient.
*   `GET /api/patients/:id`: Fetches a specific patient by their ID.

### Appointments
*   `GET /api/appointments`: Placeholder - Fetches all appointments (to be fully implemented).
*   `POST /api/appointments`: Creates a new appointment. Requires `patient_id`, `doctor_id`, `date_heure_rdv`.

### Prescriptions
*   `GET /api/prescriptions/patient/:patientId`: Placeholder - Fetches all prescriptions for a specific patient (to be fully implemented).
*   `POST /api/prescriptions`: Creates a new prescription. Requires `patient_id`, `doctor_id`, `date_prescription`, `medicaments` (JSON format).

### Doctors
*   `GET /api/doctors`: Fetches a list of all doctors.
*   `POST /api/doctors`: Creates a new doctor. Requires `nom`, `prenom`, `email`.
*   `GET /api/doctors/:id`: Fetches a specific doctor by their ID.

### Doctor Schedules
*   `GET /api/doctors/:doctorId/schedule`: Fetches all schedule entries for a specific doctor.
*   `POST /api/doctors/:doctorId/schedule`: Adds or updates a schedule entry for a doctor. Requires `jour_semaine`, `heure_debut`, `heure_fin`.
*   `DELETE /api/doctors/:doctorId/schedule/:scheduleId`: Deletes a specific schedule entry.
