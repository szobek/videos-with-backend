const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
// const middlewares = require('./middlewares');
const routes = require('./routes');


const app = express();
app.use(express.json());

routes(app);

// Session middleware
app.use(session({
    secret: '20XQpDiL%xwhsYTiU03E',
    resave: false,
    saveUninitialized: false
}));




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});