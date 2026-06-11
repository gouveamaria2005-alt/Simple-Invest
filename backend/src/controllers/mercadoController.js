const fallbackAtivos = [
    { codigo: 'PETR4.SA', nome: 'Petrobras PN', tipo: 'Ação B3', preco: 38.45, variacao: '+3.36%', valor: 'R$ 1,25', up: true, volume: 'Base local', pl: '-', fonte: 'Base local' },
    { codigo: 'ITUB4.SA', nome: 'Itaú Unibanco PN', tipo: 'Ação B3', preco: 28.90, variacao: '+1.58%', valor: 'R$ 0,45', up: true, volume: 'Base local', pl: '-', fonte: 'Base local' },
    { codigo: 'AAPL', nome: 'Apple Inc.', tipo: 'Ação EUA', preco: 195.64, variacao: '+0.42%', valor: 'US$ 0.82', up: true, volume: 'Base local', pl: '-', fonte: 'Base local' }
];

const knownSearches = {
    apple: ['AAPL'],
    aapl: ['AAPL'],
    microsoft: ['MSFT'],
    msft: ['MSFT'],
    tesla: ['TSLA'],
    amazon: ['AMZN'],
    google: ['GOOGL'],
    alphabet: ['GOOGL'],
    meta: ['META'],
    facebook: ['META'],
    nvidia: ['NVDA'],
    itau: ['ITUB4.SA', 'ITUB3.SA'],
    itaú: ['ITUB4.SA', 'ITUB3.SA'],
    petrobras: ['PETR4.SA', 'PETR3.SA'],
    vale: ['VALE3.SA'],
    bradesco: ['BBDC4.SA', 'BBDC3.SA'],
    ambev: ['ABEV3.SA'],
    magalu: ['MGLU3.SA'],
    magazine: ['MGLU3.SA']
};

function normalizeSearch(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function formatPercent(value) {
    const number = Number(value || 0);
    const signal = number >= 0 ? '+' : '';
    return `${signal}${number.toFixed(2)}%`;
}

function formatCurrency(value, currency = 'BRL') {
    return Number(value || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency
    });
}

function tipoPorSymbol(symbol) {
    return String(symbol).endsWith('.SA') ? 'Ação B3' : 'Ação EUA';
}

function localCandidates(termo) {
    const normalized = normalizeSearch(termo).replace(/\s+/g, '_');
    const raw = String(termo || '').trim().toUpperCase();
    const mapped = knownSearches[normalized];
    if (mapped) return mapped;
    if (!raw) return [];
    if (raw.includes('.')) return [raw];
    if (/\d/.test(raw)) return [`${raw}.SA`, raw];
    return [raw, `${raw}.SA`];
}

async function getJson(url) {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 SimpleInvest/1.0',
            Accept: 'application/json'
        }
    });

    if (!response.ok) throw new Error(`API respondeu ${response.status}`);
    return response.json();
}

async function buscarYahooSymbols(termo) {
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(termo)}&quotesCount=10&newsCount=0&enableFuzzyQuery=true&lang=pt-BR&region=BR`;
    const data = await getJson(url);
    return (data.quotes || [])
        .filter((quote) => quote.symbol && ['EQUITY', 'ETF', 'INDEX'].includes(quote.quoteType))
        .map((quote) => ({
            symbol: quote.symbol,
            nome: quote.longname || quote.shortname || quote.name || quote.symbol,
            tipo: quote.quoteType === 'ETF' ? 'ETF' : tipoPorSymbol(quote.symbol)
        }));
}

async function cotarYahoo(symbolInfo) {
    const symbol = symbolInfo.symbol || symbolInfo;
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1mo&interval=1d`;
    const data = await getJson(url);
    const result = data.chart?.result?.[0];
    const meta = result?.meta;
    const closes = (result?.indicators?.quote?.[0]?.close || []).filter((value) => value !== null);

    if (!meta || !Number(meta.regularMarketPrice)) return null;

    const previous = Number(meta.chartPreviousClose || closes[0] || meta.regularMarketPrice);
    const price = Number(meta.regularMarketPrice);
    const change = price - previous;
    const changePercent = previous ? (change / previous) * 100 : 0;
    const currency = meta.currency === 'BRL' ? 'BRL' : 'USD';

    return {
        codigo: symbol,
        nome: symbolInfo.nome || meta.longName || meta.shortName || symbol,
        tipo: symbolInfo.tipo || tipoPorSymbol(symbol),
        preco: price,
        variacao: formatPercent(changePercent),
        valor: formatCurrency(change, currency),
        up: change >= 0,
        volume: meta.exchangeName || meta.fullExchangeName || 'Yahoo Finance',
        pl: '-',
        fonte: 'Yahoo Finance Chart',
        moeda: currency,
        historico: closes.slice(-8)
    };
}

function parseCsvLine(line) {
    const result = [];
    let current = '';
    let quoted = false;

    for (const char of line) {
        if (char === '"') quoted = !quoted;
        else if (char === ',' && !quoted) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current);
    return result.map((value) => value.trim());
}

function symbolToStooq(symbol) {
    const normalized = String(symbol || '').trim().toUpperCase();
    if (normalized.endsWith('.SA')) return `${normalized.replace('.SA', '')}.br`.toLowerCase();
    if (/\d/.test(normalized)) return `${normalized}.br`.toLowerCase();
    return `${normalized.replace('.US', '')}.us`.toLowerCase();
}

async function cotarStooq(symbol) {
    const stooqSymbol = symbolToStooq(symbol);
    const url = `https://stooq.com/q/l/?s=${encodeURIComponent(stooqSymbol)}&f=sd2t2ohlcv&h&e=csv`;
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 SimpleInvest/1.0' } });
    if (!response.ok) throw new Error(`Stooq respondeu ${response.status}`);

    const csv = await response.text();
    const row = parseCsvLine(csv.trim().split(/\r?\n/)[1] || '');
    const close = Number(row[6]);
    const open = Number(row[3]);
    if (!row[0] || row[6] === 'N/D' || Number.isNaN(close)) return null;

    const displaySymbol = String(symbol).toUpperCase().endsWith('.SA') ? String(symbol).toUpperCase() : String(symbol).toUpperCase().replace('.US', '');
    const currency = displaySymbol.endsWith('.SA') ? 'BRL' : 'USD';
    const change = Number.isNaN(open) ? 0 : close - open;
    const changePercent = open ? (change / open) * 100 : 0;

    return {
        codigo: displaySymbol,
        nome: displaySymbol,
        tipo: tipoPorSymbol(displaySymbol),
        preco: close,
        variacao: formatPercent(changePercent),
        valor: formatCurrency(change, currency),
        up: change >= 0,
        volume: row[7] && row[7] !== 'N/D' ? Number(row[7]).toLocaleString('pt-BR') : 'Stooq',
        pl: '-',
        fonte: 'Stooq',
        moeda: currency
    };
}

async function cotarSymbols(symbolInfos) {
    const limited = symbolInfos.slice(0, 10);
    const quotes = await Promise.all(limited.map(async (item) => {
        const info = typeof item === 'string' ? { symbol: item } : item;
        try {
            return await cotarYahoo(info);
        } catch {
            try {
                return await cotarStooq(info.symbol);
            } catch {
                return null;
            }
        }
    }));

    return quotes.filter(Boolean);
}

exports.buscarAtivos = async (req, res) => {
    const termo = String(req.query.q || '').trim();

    try {
        const symbols = termo ? await buscarYahooSymbols(termo) : fallbackAtivos.map((ativo) => ({ symbol: ativo.codigo, nome: ativo.nome, tipo: ativo.tipo }));
        const candidates = symbols.length ? symbols : localCandidates(termo).map((symbol) => ({ symbol }));
        const ativos = await cotarSymbols(candidates);

        return res.json({
            fonte: ativos.some((ativo) => ativo.fonte.includes('Yahoo')) ? 'Yahoo Finance Chart' : 'Stooq',
            ativos
        });
    } catch (err) {
        try {
            const ativos = await cotarSymbols(localCandidates(termo).map((symbol) => ({ symbol })));
            if (ativos.length) return res.json({ fonte: 'Stooq', aviso: err.message, ativos });
        } catch {
            // Mantém retorno claro abaixo.
        }

        return res.status(502).json({
            erro: 'Não foi possível consultar a API de mercado agora.',
            detalhe: err.message,
            ativos: []
        });
    }
};

function extractTag(item, tag) {
    const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
    if (!match) return '';
    return match[1]
        .replace('<![CDATA[', '')
        .replace(']]>', '')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}

exports.buscarNoticias = async (req, res) => {
    const termo = String(req.query.q || 'mercado financeiro').trim();
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${termo} ações OR bolsa OR mercado financeiro`)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 SimpleInvest/1.0',
                Accept: 'application/rss+xml,text/xml'
            }
        });
        if (!response.ok) throw new Error(`Google News respondeu ${response.status}`);

        const xml = await response.text();
        const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
        const noticias = items.slice(0, 12).map((item) => ({
            titulo: extractTag(item, 'title'),
            fonte: 'Google News',
            data: extractTag(item, 'pubDate') ? new Date(extractTag(item, 'pubDate')).toLocaleDateString('pt-BR') : 'Atual',
            texto: extractTag(item, 'description') || extractTag(item, 'title'),
            link: extractTag(item, 'link')
        })).filter((noticia) => noticia.titulo);

        return res.json({ fonte: 'Google News RSS', noticias });
    } catch (err) {
        return res.status(502).json({
            erro: 'Não foi possível consultar a API de notícias agora.',
            detalhe: err.message,
            noticias: []
        });
    }
};
