const middlewares = require('./middlewares');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');


const convertResult = (results) => {
    const movie_data = [];
    for (let movie of results) {
      if (movie_data.filter(mov => mov.type === movie.type).length === 0) {
        movie_data.push({
          type: movie.type,
          movies: []
        })
      }
  
      for (let mov of movie_data) {
        if (mov.type === movie.type) {
          mov.movies.push({
            ID: movie.ID,
            name: movie.name,
            description: movie.description,
            type: movie.type
          });
        }
      }
  
    }
    return movie_data;
  }

  
module.exports = (app) => {

    app.get("/video-types", (req, res) => {
        const queryString = 'SELECT * FROM `videos`';
        db.query(queryString, (err, results) => {
          if (err) throw err;
          const movie_data = convertResult(results);
          res.status(200);  
          res.send(JSON.stringify(movie_data));
        }
        )
        
      });
      
  app.get("/video/:name", (req, res) => {
    const videoName = req.params.name;
    const videoPath = path.join(__dirname, 'videos', `${videoName}.mp4`);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle range request (partial content)
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const fileStream = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      fileStream.pipe(res);
    } else {
      // Send full video if no range is specified
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  });
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

    app.get('/videos',(req, res) => {
        const result =  db.query(
            'SELECT * FROM `videos` '
          );
          res.status(200);
          res.sendFile(path.join(__dirname, "public/views", "video-list.html"));
    }
    )
    // Protected route example
    app.get('/protected', middlewares.jwtHandler, (req, res) => {
        res.json({ message: 'This is a protected route', user: req.user });
    });
    app.get('/save-data', middlewares.jwtHandler, (req, res) => {
        res.json({ message: 'This is a protected save data route' });
    });

}