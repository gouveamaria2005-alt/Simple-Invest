const db = require('../config/db');

module.exports = (tabela, coluna = 'usuario_id') => async (req, res, next) => {
    try {
        const [rows] = await db.query(
            `SELECT * FROM ${tabela} WHERE id = ? AND ${coluna} = ?`,
            [req.params.id, req.usuario.id]
        );

        if (rows.length === 0)
            return res.status(403).json({ erro: 'Você não tem permissão para isso.' });

        next();
    } catch {
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};