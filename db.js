const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});
connection.connect((err) => {
    if (err) {
        console.log('Error connecting to database');
        return;
    }
    console.log('Connected to database');
});

// Create users table if it doesn't exist
connection.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    )
`);

module.exports = connection;