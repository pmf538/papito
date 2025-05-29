const mysql = require('mysql2/promise');

// Replace with your actual database credentials and details
const pool = mysql.createPool({
  host: 'localhost', // or your db host
  user: 'root',      // your db user
  password: '',    // your db password
  database: 'medical_app_db', // your db name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection (optional, can be uncommented for quick test if db is ready)
// pool.getConnection()
//   .then(conn => {
//     console.log('Successfully connected to the database.');
//     conn.release();
//   })
//   .catch(err => {
//     console.error('Error connecting to the database:', err.stack);
//   });

module.exports = pool;
