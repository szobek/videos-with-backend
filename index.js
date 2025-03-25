const express = require('express');
const session = require('express-session');
const routes = require('./routes');
const path = require('path');
const app = express();
const authRoutes = require('./authRoutes');

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});