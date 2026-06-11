const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { gerarCodigo, enviarCodigo } = require('../services/emailService');

const jwtSecret = process.env.JWT_SECRET || 'simple-invest-dev-secret';
const CODE_TTL_MINUTES = 15;

function normalizarEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function codigoExpirado(data) {
    if (!data) return true;
    return new Date(data).getTime() < Date.now();
}

function mysqlDateTime(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

async function salvarCodigoVerificacao(email) {
    const codigo = gerarCodigo();
    const expiraEm = mysqlDateTime(new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000));
    await db.query('UPDATE usuarios SET codigo_verificacao = ?, codigo_expira_em = ? WHERE email = ?', [codigo, expiraEm, email]);
    const envio = await enviarCodigo(email, codigo, 'Validação de e-mail - Simple Invest', 'validar seu e-mail');
    return envio.modo === 'desenvolvimento' ? codigo : undefined;
}

async function salvarCodigoRecuperacao(email) {
    const codigo = gerarCodigo();
    const expiraEm = mysqlDateTime(new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000));
    await db.query('UPDATE usuarios SET codigo_recuperacao = ?, recuperacao_expira_em = ? WHERE email = ?', [codigo, expiraEm, email]);
    const envio = await enviarCodigo(email, codigo, 'Recuperação de senha - Simple Invest', 'redefinir sua senha');
    return envio.modo === 'desenvolvimento' ? codigo : undefined;
}

exports.register = async (req, res) => {
    const { nome, senha } = req.body;
    const email = normalizarEmail(req.body.email);

    if (!nome || !email || !senha)
        return res.status(400).json({ erro: 'Preencha todos os campos.' });
    if (senha.length < 6)
        return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres.' });

    try {
        const [existe] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existe.length > 0)
            return res.status(400).json({ erro: 'Email já cadastrado.' });

        const hash = await bcrypt.hash(senha, 10);
        await db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hash]);
        const codigoDesenvolvimento = await salvarCodigoVerificacao(email);

        res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso! Enviamos um código para validar seu e-mail.',
            precisaValidarEmail: true,
            codigoDesenvolvimento,
            redirect: '/login'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};

exports.login = async (req, res) => {
    const email = normalizarEmail(req.body.email);
    const { senha } = req.body;

    if (!email || !senha)
        return res.status(400).json({ erro: 'Preencha todos os campos.' });

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0)
            return res.status(401).json({ erro: 'Usuário não encontrado.' });

        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida)
            return res.status(401).json({ erro: 'Email ou senha incorretos.' });

        if (!usuario.email_verificado) {
            const codigoDesenvolvimento = await salvarCodigoVerificacao(email);
            return res.status(403).json({
                erro: 'Antes de entrar, valide seu e-mail com o código enviado.',
                emailPendente: true,
                email,
                codigoDesenvolvimento
            });
        }

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome },
            jwtSecret,
            { expiresIn: '8h' }
        );

        res.json({ token, nome: usuario.nome });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};

exports.verifyEmail = async (req, res) => {
    const email = normalizarEmail(req.body.email);
    const codigo = String(req.body.codigo || '').trim();

    if (!email || !codigo)
        return res.status(400).json({ erro: 'Informe e-mail e código.' });

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0)
            return res.status(404).json({ erro: 'Usuário não encontrado.' });

        const usuario = rows[0];
        if (usuario.email_verificado)
            return res.json({ mensagem: 'E-mail já validado.' });

        if (usuario.codigo_verificacao !== codigo || codigoExpirado(usuario.codigo_expira_em))
            return res.status(400).json({ erro: 'Código inválido ou expirado.' });

        await db.query('UPDATE usuarios SET email_verificado = ?, codigo_verificacao = ?, codigo_expira_em = ? WHERE email = ?', [1, null, null, email]);
        res.json({ mensagem: 'E-mail validado com sucesso. Você já pode entrar.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};

exports.resendCode = async (req, res) => {
    const email = normalizarEmail(req.body.email);

    if (!email)
        return res.status(400).json({ erro: 'Informe o e-mail.' });

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0)
            return res.status(404).json({ erro: 'Usuário não encontrado.' });

        const codigoDesenvolvimento = await salvarCodigoVerificacao(email);
        res.json({ mensagem: 'Código reenviado para o e-mail informado.', codigoDesenvolvimento });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};

exports.forgotPassword = async (req, res) => {
    const email = normalizarEmail(req.body.email);

    if (!email)
        return res.status(400).json({ erro: 'Informe o e-mail.' });

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0)
            return res.status(404).json({ erro: 'Usuário não encontrado.' });

        const codigoDesenvolvimento = await salvarCodigoRecuperacao(email);
        res.json({ mensagem: 'Enviamos um código de recuperação para seu e-mail.', codigoDesenvolvimento });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};

exports.resetPassword = async (req, res) => {
    const email = normalizarEmail(req.body.email);
    const codigo = String(req.body.codigo || '').trim();
    const novaSenha = String(req.body.novaSenha || '');

    if (!email || !codigo || !novaSenha)
        return res.status(400).json({ erro: 'Informe e-mail, código e nova senha.' });
    if (novaSenha.length < 6)
        return res.status(400).json({ erro: 'A nova senha deve ter no mínimo 6 caracteres.' });

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0)
            return res.status(404).json({ erro: 'Usuário não encontrado.' });

        const usuario = rows[0];
        if (usuario.codigo_recuperacao !== codigo || codigoExpirado(usuario.recuperacao_expira_em))
            return res.status(400).json({ erro: 'Código inválido ou expirado.' });

        const hash = await bcrypt.hash(novaSenha, 10);
        await db.query('UPDATE usuarios SET senha = ?, codigo_recuperacao = ?, recuperacao_expira_em = ? WHERE email = ?', [hash, null, null, email]);
        res.json({ mensagem: 'Senha redefinida com sucesso. Faça login novamente.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};
