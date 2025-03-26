const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
console.log(process.env.DB_HOST);

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