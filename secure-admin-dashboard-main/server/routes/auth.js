const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authcontrollers');

// Auth routes
router.post('/login', login);      // expects { username, email, password }
router.post('/register', register); // expects { username, email, password, role }

module.exports = router;