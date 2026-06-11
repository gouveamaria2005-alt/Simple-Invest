const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'simple-invest-dev-secret';

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.status(401).json({ erro: 'Token não fornecido.' });

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.usuario = decoded;
        next();
    } catch {
        res.status(403).json({ erro: 'Token inválido.' });
    }
};
