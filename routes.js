const middlewares = require('./middlewares');
const fs = require('fs');
const path = require('path');

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
        const videoPath = path.join(__dirname, 'videos', `${videoName}`);
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
  

    app.get('/videos', (req, res) => {
        const result = db.query(
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

    app.get('/watch/:id', (req, res) => {
        const queryString = 'SELECT * FROM `videos` WHERE ID = ?';
        
        db.query(queryString, [req.params.id], (err, results) => {
            if (err) throw err;
            res.status(200);
            res.render('watch', { id: req.params.id,src: `http://localhost:3000/video/${results[0].name}` });
        })
    });


}