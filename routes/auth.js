const express  = require('express');
const bcrypt   = require('bcryptjs');
const passport = require('passport');
const User     = require('../models/User');

const router = express.Router();

// REGISTER PAGE
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register', searchQuery: '' });
});

// REGISTER USER
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simple check if user exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res.redirect('/register'); // could add error later
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed });

    res.redirect('/login');
  } catch (err) {
    console.error('Register error:', err);
    res.redirect('/register');
  }
});

// LOGIN PAGE
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login', searchQuery: '' });
});

// LOGIN USER with Passport
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

// LOGOUT
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/login');
  });
});

module.exports = router;
