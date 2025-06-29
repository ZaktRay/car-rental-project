const {verifyToken} = require('../controllers/verify.token');
const express = require('express');
const router = express.Router();

router.get('/verify-token',verifyToken);

module.exports = router;

