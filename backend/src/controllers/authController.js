const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha)
        return res.status(400).json({ erro: 'Preencha todos os campos.' });

    try {
        const [existe] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existe.length > 0)
            return res.status(400).json({ erro: 'Email já cadastrado.' });

        const hash = await bcrypt.hash(senha, 10);
        await db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash]);

        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha)
        return res.status(400).json({ erro: 'Preencha todos os campos.' });

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0)
            return res.status(401).json({ erro: 'Email ou senha incorretos.' });

        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida)
            return res.status(401).json({ erro: 'Email ou senha incorretos.' });

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token, nome: usuario.nome });
    } catch (err) {
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};