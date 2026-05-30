const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const {
    getInvestimentos,
    getInvestimento,
    createInvestimento,
    updateInvestimento,
    deleteInvestimento
} = require('../controllers/investimentoController');
const checkOwner = require('../middlewares/checkOwner');

router.get('/', auth, getInvestimentos);
router.get('/:id', auth, getInvestimento);
router.post('/', auth, createInvestimento);
router.put('/:id', auth, updateInvestimento);
router.delete('/:id', auth, deleteInvestimento);
router.put('/:id', auth, checkOwner('investimentos'), updateInvestimento);
router.delete('/:id', auth, checkOwner('investimentos'), deleteInvestimento);

module.exports = router;