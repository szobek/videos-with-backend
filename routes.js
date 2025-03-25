const middlewares = require('./middlewares');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');
module.exports = (app) => {
    
// Register route
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if user already exists
        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Insert new user
            db.query(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [username, hashedPassword],
                (err, result) => {
                    if (err) throw err;
                    res.status(201).json({ message: 'User registered successfully' });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
            if (err) throw err;
            
            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = results[0];
            
            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, username: user.username },
                'your-secret-key',
                { expiresIn: '1h' }
            );

            res.json({ message: 'Login successful', token });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Protected route example
app.get('/protected', middlewares.jwtHandler, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});
app.get('/save-data', middlewares.jwtHandler, (req, res) => {
    res.json({ message: 'This is a protected save data route' });
});

}