const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
// const middlewares = require('./middlewares');
const routes = require('./routes');


const app = express();
app.use(express.json());
// app.use(middlewares.jwtHandler);
// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

routes(app);
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected');
});

// Session middleware
app.use(session({
    secret: '20XQpDiL%xwhsYTiU03E',
    resave: false,
    saveUninitialized: false
}));

// Create users table if it doesn't exist
db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    )
`);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});