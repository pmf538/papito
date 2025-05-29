const app = require('./app'); // Import the app configuration
const port = process.env.PORT || 3001;

// Start the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

// Export the app for potential programmatic use (though app.js is the primary export for testing)
module.exports = app;
