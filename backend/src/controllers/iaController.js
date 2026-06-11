exports.perguntar = async (req, res) => {
    const pergunta = String(req.body.pergunta || '').trim();

    if (!pergunta) {
        return res.status(400).json({ erro: 'Digite uma pergunta.' });
    }

    if (!process.env.OPENAI_API_KEY) {
        return res.status(400).json({
            erro: 'IA não configurada. Defina OPENAI_API_KEY no arquivo .env para ativar o assistente.'
        });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
                input: [
                    {
                        role: 'system',
                        content: 'Você é um assistente educacional do Simple Invest. Responda em português do Brasil, com linguagem simples, sobre mercado financeiro, investimentos, bolsa, renda fixa, renda variável e educação financeira. Não dê recomendação personalizada de compra ou venda. Explique riscos e diga quando algo depende do perfil do investidor.'
                    },
                    {
                        role: 'user',
                        content: pergunta
                    }
                ]
            })
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({ erro: data.error?.message || 'Erro ao consultar a IA.' });
        }

        const resposta = data.output_text || data.output?.flatMap((item) => item.content || []).map((item) => item.text).join('\n') || 'Não consegui gerar uma resposta agora.';
        return res.json({ resposta });
    } catch (err) {
        return res.status(500).json({ erro: 'Erro ao consultar a IA.', detalhe: err.message });
    }
};
