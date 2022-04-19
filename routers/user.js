const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  logout,
  validateUser,
} = require('./../controllers/auth');
const { getUserList, getUser } = require('./../controllers/user');

router.post('/signup', validateUser, signup);
router.post('/login', login);
router.get('/logout', logout);

router.get('',getUserList);
router.get('/:id',getUser);

module.exports = router;
