const express = require('express');
const router = express.Router();
const { buscarAtivos, buscarNoticias } = require('../controllers/mercadoController');

router.get('/ativos', buscarAtivos);
router.get('/noticias', buscarNoticias);

module.exports = router;
