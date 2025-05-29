module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  // Automatically stop the server after all tests are done
  // This might be needed if 'db.js' or other modules keep connections open
  // globalTeardown: '<rootDir>/test-teardown.js' // Optional: if you need a custom teardown
  forceExit: true, // Add this if tests hang due to open handles (like db connections)
  detectOpenHandles: true, // Helps identify open handles
};
