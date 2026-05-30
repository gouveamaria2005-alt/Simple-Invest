const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getPerfil, updatePerfil, deletePerfil } = require('../controllers/usuarioController');

router.get('/', auth, getPerfil);
router.put('/', auth, updatePerfil);
router.delete('/', auth, deletePerfil);

module.exports = router;