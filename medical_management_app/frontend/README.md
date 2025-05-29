# Medical Management App - Frontend

## Description

This is the frontend user interface for the Medical Management Application. It's a React application built using Create React App, designed to interact with the backend API to manage patients, doctors, appointments, and prescriptions.

## Prerequisites

*   **Node.js**: Version 16+ is recommended (current environment uses v18.x).
*   **npm**: Should be installed with Node.js (current environment uses v9.x). (Yarn can also be used).
*   **Backend Server Running**: The backend API service must be running and accessible. This frontend is configured to proxy API requests to `http://localhost:3001` (as defined in `package.json`). Ensure the backend is started before running the frontend.

## Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd medical_management_app/frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
    (or if you prefer yarn: `yarn install`)

## Running the Application

1.  **Start the development server:**
    ```bash
    npm start
    ```
2.  This command runs the app in development mode.
3.  Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
4.  The page will reload if you make edits. You will also see any lint errors in the console.

## Running Tests

1.  **Execute the test suite:**
    ```bash
    npm test
    ```
    This command launches the test runner. In this project, it has been configured via `package.json` to run with `react-scripts test --watchAll=false` for non-interactive execution in some environments.
    It will run tests related to components and other frontend logic.

## Key Features/Components

The frontend application provides the following main features:

*   **Patient Management:**
    *   View a list of all patients.
    *   Add new patients to the system.
*   **Doctor Management:**
    *   View a list of all doctors.
    *   Add new doctors to the system.
    *   Manage doctor schedules (view, add, delete schedule entries).
*   **Appointment Scheduling:**
    *   Schedule new appointments for patients with available doctors.
*   **Prescription Management:**
    *   Create new prescriptions for patients, linked to a doctor.

## Available Scripts (from Create React App)

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner for the application.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information. (Modified in this project to `react-scripts test --watchAll=false`).

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
