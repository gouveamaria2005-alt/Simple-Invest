const db = require('../config/db');

exports.getPerfil = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, nome, email, telefone, foto, criado_em FROM usuarios WHERE id = ?',
            [req.usuario.id]
        );
        if (rows.length === 0)
            return res.status(404).json({ erro: 'Usuário não encontrado.' });

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};

exports.updatePerfil = async (req, res) => {
    const { nome, telefone, foto } = req.body;
    try {
        await db.query(
            'UPDATE usuarios SET nome = ?, telefone = ?, foto = ? WHERE id = ?',
            [nome, telefone, foto, req.usuario.id]
        );
        res.json({ mensagem: 'Perfil atualizado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};

exports.deletePerfil = async (req, res) => {
    try {
        await db.query('DELETE FROM usuarios WHERE id = ?', [req.usuario.id]);
        res.json({ mensagem: 'Conta deletada com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};
