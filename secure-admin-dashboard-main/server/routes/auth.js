const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authcontrollers');
const { body } = require('express-validator');

// Auth routes
router.post('/login', login);      // expects { username, email, password }
router.post('/register', [
  body('username').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], register); // expects { username, email, password, role }

module.exports = router;