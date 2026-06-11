const db = require('../config/db');

exports.getInvestimentos = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM investimentos WHERE usuario_id = ?',
            [req.usuario.id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};

exports.getInvestimento = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM investimentos WHERE id = ? AND usuario_id = ?',
            [req.params.id, req.usuario.id]
        );
        if (rows.length === 0)
            return res.status(404).json({ erro: 'Investimento não encontrado.' });

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};

exports.createInvestimento = async (req, res) => {
    const { tipo, valor, data_inicio, descricao } = req.body;
    const valorNumerico = Number(valor);

    if (!tipo || !valor || !data_inicio)
        return res.status(400).json({ erro: 'Preencha os campos obrigatórios.' });
    if (Number.isNaN(valorNumerico) || valorNumerico <= 0)
        return res.status(400).json({ erro: 'Informe um valor maior que zero.' });

    try {
        const [result] = await db.query(
            'INSERT INTO investimentos (usuario_id, tipo, valor, data_inicio, descricao) VALUES (?, ?, ?, ?, ?)',
            [req.usuario.id, tipo, valorNumerico, data_inicio, descricao]
        );
        res.status(201).json({ mensagem: 'Investimento cadastrado com sucesso!', id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};

exports.updateInvestimento = async (req, res) => {
    const { tipo, valor, data_inicio, descricao } = req.body;
    const valorNumerico = Number(valor);

    if (!tipo || !valor || !data_inicio)
        return res.status(400).json({ erro: 'Preencha os campos obrigatórios.' });
    if (Number.isNaN(valorNumerico) || valorNumerico <= 0)
        return res.status(400).json({ erro: 'Informe um valor maior que zero.' });

    try {
        const [result] = await db.query(
            'UPDATE investimentos SET tipo = ?, valor = ?, data_inicio = ?, descricao = ? WHERE id = ? AND usuario_id = ?',
            [tipo, valorNumerico, data_inicio, descricao, req.params.id, req.usuario.id]
        );
        if (result.affectedRows === 0)
            return res.status(404).json({ erro: 'Investimento não encontrado.' });

        res.json({ mensagem: 'Investimento atualizado com sucesso!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};

exports.deleteInvestimento = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM investimentos WHERE id = ? AND usuario_id = ?',
            [req.params.id, req.usuario.id]
        );
        if (result.affectedRows === 0)
            return res.status(404).json({ erro: 'Investimento não encontrado.' });

        res.json({ mensagem: 'Investimento deletado com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor.' });
    }
};
