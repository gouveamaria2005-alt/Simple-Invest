const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const investimentoRoutes = require('./routes/investimentoRoutes');
const mercadoRoutes = require('./routes/mercadoRoutes');
const iaRoutes = require('./routes/iaRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const frontendPath = path.join(__dirname, '..', '..', 'frontend');

app.use(cors());
app.use(express.json());
app.use(express.static(frontendPath));

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        projeto: 'Simple Invest',
        banco: process.env.DB_CLIENT === 'mysql' ? 'mysql' : 'json-local'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/investimentos', investimentoRoutes);
app.use('/api/mercado', mercadoRoutes);
app.use('/api/ia', iaRoutes);

app.get('/api/dashboard', authMiddleware, (req, res) => {
    res.json({
        mensagem: `Bem-vindo, ${req.usuario.nome}!`,
        usuario: req.usuario
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Simple Invest rodando em http://localhost:${PORT}`);
    });
}

module.exports = app;
