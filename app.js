// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Connect to database
// connectDB();

// // Routes
// app.use('/auth', require('./routes/auth'));
// app.use('/users', require('./routes/users'));
// app.use('/stocks', require('./routes/stocks'));

// // Error handling
// app.use((err, req, res, next) => {
//     res.status(500).json({ message: err.message });
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });



const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stocks');
const userRoutes = require('./routes/users');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
  }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Middleware to parse JSON
app.use(express.json());

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRoutes);
app.use('/stocks', stockRoutes);
app.use('/users', userRoutes);

// Serve the index.html file for the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/home', (req, res) => {
    res.render("bot.ejs");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
