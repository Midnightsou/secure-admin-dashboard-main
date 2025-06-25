const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Find user by username and email
        const foundUser = await User.findOne({ username, email });
        if (!foundUser) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: foundUser._id, role: foundUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Respond with token and user info (excluding password)
        res.json({
            token,
            user: {
                id: foundUser._id,
                username: foundUser.username,
                email: foundUser.email,
                role: foundUser.role
            }
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ msg: 'Username or email already exists' });
        }

        // Hash password and create user
        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashed, role });
        await newUser.save();
        res.status(201).json({ msg: 'User created' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};