const express = require('express');
const router = express.Router();
const { perguntar } = require('../controllers/iaController');

router.post('/perguntar', perguntar);

module.exports = router;
