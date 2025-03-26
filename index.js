const express = require('express');
require("dotenv").config(); 
const session = require('express-session');
const routes = require('./routes');
const path = require('path');
const app = express();
const authRoutes = require('./authRoutes');
const db = require('./db');


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
routes(app);
authRoutes(app);
// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));
// Session middleware
app.use(session({
    secret: '20XQpDiL%xwhsYTiU03E',
    resave: false,
    saveUninitialized: false
}));



const createUserTable=` CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL DEFAULT 'user'
    );`
const createVideosTable=`CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        type TEXT DEFAULT 'test',
        rating INT DEFAULT 1
    );`
const insertRowsToVideosTable=`INSERT INTO videos (id,name, description,type, rating) VALUES
    (NULL,'sample.mp4','Lorem ipsum dolor sit amet, consectetur adipiscing elit' , 'comedy', 1),
    (NULL,'sample.mp4','Lorem ipsum dolor sit amet, consectetur adipiscing elit' , 'comedy',1),
    (NULL,'sample.mp4','Lorem ipsum dolor sit amet, consectetur adipiscing elit' , 'comedy',1),
    (NULL,'sample.mp4','Lorem ipsum dolor sit amet, consectetur adipiscing elit' , 'romantic',1),
    (NULL,'sample.mp4','Lorem ipsum dolor sit amet, consectetur adipiscing elit' , 'romantic',1),
    (NULL,'sample.mp4','Lorem ipsum dolor sit amet, consectetur adipiscing elit' , 'romantic',1),
    (NULL,'sample.mp4','Lorem ipsum dolor sit amet, consectetur adipiscing elit' , 'fiction',1),
    (NULL,'sample.mp4','Lorem ipsum dolor sit amet, consectetur adipiscing elit' , 'fiction',1),
    (NULL,'sample.mp4','Lorem ipsum dolor sit amet, consectetur adipiscing elit' , 'thriller',1),
    (NULL,'sample.mp4','Lorem ipsum dolor sit amet, consectetur adipiscing elit' , 'comedy',1),
    (NULL,'sample.mp4','Lorem ipsum dolor sit amet, consectetur adipiscing elit' ,'thriller', 1)`
    
    db.query(createUserTable);
    db.query(createVideosTable);
    db.query(insertRowsToVideosTable)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});