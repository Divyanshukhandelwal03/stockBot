const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Signup controller
exports.signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({ username, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.status(201).json({ message: 'Signup successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Login controller
exports.login = async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    try {
        // Find user by username
        console.log(username);
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('jwt', token, {
            httpOnly: true, // Ensures the cookie cannot be accessed by client-side scripts
            secure: process.env.NODE_ENV === 'production', // Ensure it's sent over HTTPS in production
            maxAge: 3600000 // 1 hour (in milliseconds)
        });
        
       
        // res.json({ token });
        res.render('bot.ejs');
        // res.redirect("/home");
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};
