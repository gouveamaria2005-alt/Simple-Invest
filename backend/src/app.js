const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const investimentoRoutes = require('./routes/investimentoRoutes');


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/usuario', usuarioRoutes);
app.use('/api/investimentos', investimentoRoutes);

app.use('/api/auth', authRoutes);

const authMiddleware = require('./middlewares/authMiddleware');
app.get('/api/dashboard', authMiddleware, (req, res) => {
    res.json({ mensagem: `Bem-vindo, ${req.usuario.nome}!` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));