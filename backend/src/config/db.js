const fs = require('fs/promises');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const useMysql = process.env.DB_CLIENT !== 'json';

if (useMysql) {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'simple_invest',
        waitForConnections: true,
        connectionLimit: 10
    });

    module.exports = pool.promise();
    return;
}

const dataFile = path.resolve(
    __dirname,
    '..',
    '..',
    process.env.LOCAL_DB_FILE || 'data/simple-invest.json'
);

const emptyDatabase = {
    usuarios: [],
    investimentos: []
};

async function readData() {
    try {
        const content = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(content);
    } catch {
        await fs.mkdir(path.dirname(dataFile), { recursive: true });
        await fs.writeFile(dataFile, JSON.stringify(emptyDatabase, null, 2));
        return { ...emptyDatabase };
    }
}

async function writeData(data) {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

function nextId(items) {
    return items.length ? Math.max(...items.map((item) => Number(item.id))) + 1 : 1;
}

function publicUser(usuario) {
    if (!usuario) return usuario;
    const { senha, ...safeUser } = usuario;
    return safeUser;
}

async function query(sql, params = []) {
    const normalized = sql.replace(/\s+/g, ' ').trim();
    const data = await readData();

    if (normalized === 'SELECT id FROM usuarios WHERE email = ?') {
        return [data.usuarios.filter((usuario) => usuario.email === params[0]).map(({ id }) => ({ id }))];
    }

    if (normalized === 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)') {
        const usuario = {
            id: nextId(data.usuarios),
            nome: params[0],
            email: params[1],
            senha: params[2],
            telefone: '',
            foto: '',
            email_verificado: false,
            codigo_verificacao: '',
            codigo_expira_em: '',
            codigo_recuperacao: '',
            recuperacao_expira_em: '',
            criado_em: new Date().toISOString()
        };
        data.usuarios.push(usuario);
        await writeData(data);
        return [{ insertId: usuario.id, affectedRows: 1 }];
    }

    if (normalized === 'SELECT * FROM usuarios WHERE email = ?') {
        return [data.usuarios.filter((usuario) => usuario.email === params[0])];
    }

    if (normalized === 'SELECT id, nome, email, telefone, foto, criado_em FROM usuarios WHERE id = ?') {
        return [data.usuarios.filter((usuario) => Number(usuario.id) === Number(params[0])).map(publicUser)];
    }

    if (normalized === 'UPDATE usuarios SET codigo_verificacao = ?, codigo_expira_em = ? WHERE email = ?') {
        const usuario = data.usuarios.find((item) => item.email === params[2]);
        if (!usuario) return [{ affectedRows: 0 }];
        usuario.codigo_verificacao = params[0];
        usuario.codigo_expira_em = params[1];
        await writeData(data);
        return [{ affectedRows: 1 }];
    }

    if (normalized === 'UPDATE usuarios SET email_verificado = ?, codigo_verificacao = ?, codigo_expira_em = ? WHERE email = ?') {
        const usuario = data.usuarios.find((item) => item.email === params[3]);
        if (!usuario) return [{ affectedRows: 0 }];
        usuario.email_verificado = Boolean(params[0]);
        usuario.codigo_verificacao = params[1] || '';
        usuario.codigo_expira_em = params[2] || '';
        await writeData(data);
        return [{ affectedRows: 1 }];
    }

    if (normalized === 'UPDATE usuarios SET codigo_recuperacao = ?, recuperacao_expira_em = ? WHERE email = ?') {
        const usuario = data.usuarios.find((item) => item.email === params[2]);
        if (!usuario) return [{ affectedRows: 0 }];
        usuario.codigo_recuperacao = params[0];
        usuario.recuperacao_expira_em = params[1];
        await writeData(data);
        return [{ affectedRows: 1 }];
    }

    if (normalized === 'UPDATE usuarios SET senha = ?, codigo_recuperacao = ?, recuperacao_expira_em = ? WHERE email = ?') {
        const usuario = data.usuarios.find((item) => item.email === params[3]);
        if (!usuario) return [{ affectedRows: 0 }];
        usuario.senha = params[0];
        usuario.codigo_recuperacao = params[1] || '';
        usuario.recuperacao_expira_em = params[2] || '';
        await writeData(data);
        return [{ affectedRows: 1 }];
    }

    if (normalized === 'UPDATE usuarios SET nome = ?, telefone = ?, foto = ? WHERE id = ?') {
        const usuario = data.usuarios.find((item) => Number(item.id) === Number(params[3]));
        if (!usuario) return [{ affectedRows: 0 }];
        usuario.nome = params[0] || usuario.nome;
        usuario.telefone = params[1] || '';
        usuario.foto = params[2] || '';
        await writeData(data);
        return [{ affectedRows: 1 }];
    }

    if (normalized === 'DELETE FROM usuarios WHERE id = ?') {
        const totalAntes = data.usuarios.length;
        data.usuarios = data.usuarios.filter((usuario) => Number(usuario.id) !== Number(params[0]));
        data.investimentos = data.investimentos.filter((investimento) => Number(investimento.usuario_id) !== Number(params[0]));
        await writeData(data);
        return [{ affectedRows: totalAntes - data.usuarios.length }];
    }

    if (normalized === 'SELECT * FROM investimentos WHERE usuario_id = ?') {
        return [data.investimentos.filter((investimento) => Number(investimento.usuario_id) === Number(params[0]))];
    }

    if (normalized === 'SELECT * FROM investimentos WHERE id = ? AND usuario_id = ?') {
        return [data.investimentos.filter((investimento) => (
            Number(investimento.id) === Number(params[0]) &&
            Number(investimento.usuario_id) === Number(params[1])
        ))];
    }

    if (normalized === 'INSERT INTO investimentos (usuario_id, tipo, valor, data_inicio, descricao) VALUES (?, ?, ?, ?, ?)') {
        const investimento = {
            id: nextId(data.investimentos),
            usuario_id: Number(params[0]),
            tipo: params[1],
            valor: Number(params[2]),
            data_inicio: params[3],
            descricao: params[4] || '',
            criado_em: new Date().toISOString()
        };
        data.investimentos.push(investimento);
        await writeData(data);
        return [{ insertId: investimento.id, affectedRows: 1 }];
    }

    if (normalized === 'UPDATE investimentos SET tipo = ?, valor = ?, data_inicio = ?, descricao = ? WHERE id = ? AND usuario_id = ?') {
        const investimento = data.investimentos.find((item) => (
            Number(item.id) === Number(params[4]) &&
            Number(item.usuario_id) === Number(params[5])
        ));
        if (!investimento) return [{ affectedRows: 0 }];
        investimento.tipo = params[0];
        investimento.valor = Number(params[1]);
        investimento.data_inicio = params[2];
        investimento.descricao = params[3] || '';
        await writeData(data);
        return [{ affectedRows: 1 }];
    }

    if (normalized === 'DELETE FROM investimentos WHERE id = ? AND usuario_id = ?') {
        const totalAntes = data.investimentos.length;
        data.investimentos = data.investimentos.filter((investimento) => !(
            Number(investimento.id) === Number(params[0]) &&
            Number(investimento.usuario_id) === Number(params[1])
        ));
        await writeData(data);
        return [{ affectedRows: totalAntes - data.investimentos.length }];
    }

    throw new Error(`Consulta não suportada pelo banco local: ${normalized}`);
}

module.exports = { query };
