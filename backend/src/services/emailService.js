let nodemailer = null;

try {
    nodemailer = require('nodemailer');
} catch {
    nodemailer = null;
}

function gerarCodigo() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function emailConfigurado() {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && nodemailer);
}

async function enviarCodigo(email, codigo, assunto, objetivo) {
    if (!emailConfigurado()) {
        console.log(`[Simple Invest][DEV] Código de ${objetivo} para ${email}: ${codigo}`);
        return { enviado: false, modo: 'desenvolvimento' };
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: assunto,
        text: `Seu código Simple Invest é ${codigo}. Ele expira em 15 minutos.`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #0f172a;">
                <h2>Simple Invest</h2>
                <p>Use o código abaixo para ${objetivo}:</p>
                <strong style="font-size: 28px; letter-spacing: 4px;">${codigo}</strong>
                <p>Este código expira em 15 minutos.</p>
            </div>
        `
    });

    return { enviado: true, modo: 'smtp' };
}

module.exports = {
    gerarCodigo,
    enviarCodigo
};
