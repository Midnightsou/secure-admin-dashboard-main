const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.login = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const foundUser = await User.findOne({ username, email });
        if (!foundUser) {
            return res.status(401).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: foundUser._id, role: foundUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ msg: 'Username or email already exists' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashed, role });
        await newUser.save();
        res.status(201).json({ msg: 'User created' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};