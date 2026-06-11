const API = window.location.origin.includes('3000')
  ? `${window.location.origin}/api`
  : 'http://localhost:3000/api';

const FAVORITES_KEY = 'simpleInvestFavoritos';
let latestAssetsSource = 'API de mercado';

const ativosBase = [
  { codigo: 'PETR4.SA', nome: 'Petrobras PN', tipo: 'Ação', preco: 38.45, variacao: '+3.36%', valor: 'R$ 1,25', up: true, volume: 'R$ 2.5B', pl: '7.80', fav: true, fonte: 'Base local', historico: [32, 34, 33, 35, 36, 38, 37, 39] },
  { codigo: 'VALE3.SA', nome: 'Vale ON', tipo: 'Ação', preco: 65.30, variacao: '-1.28%', valor: 'R$ 0,85', up: false, volume: 'R$ 1.8B', pl: '5.20', fav: false, fonte: 'Base local', historico: [71, 69, 68, 70, 67, 66, 65, 64] },
  { codigo: 'ITUB4.SA', nome: 'Itaú Unibanco PN', tipo: 'Ação', preco: 28.90, variacao: '+1.58%', valor: 'R$ 0,45', up: true, volume: 'R$ 890M', pl: '9.10', fav: true, fonte: 'Base local', historico: [24, 25, 25.5, 26, 27, 26.8, 28, 29] },
  { codigo: 'BBDC4.SA', nome: 'Bradesco PN', tipo: 'Ação', preco: 14.22, variacao: '+0.80%', valor: 'R$ 0,11', up: true, volume: 'R$ 560M', pl: '8.90', fav: false, fonte: 'Base local', historico: [12, 12.4, 12.1, 13, 13.5, 13.2, 14, 14.2] },
  { codigo: 'ABEV3.SA', nome: 'Ambev ON', tipo: 'Ação', preco: 11.34, variacao: '-0.34%', valor: 'R$ 0,04', up: false, volume: 'R$ 310M', pl: '12.40', fav: false, fonte: 'Base local', historico: [13, 12.8, 12.2, 12, 11.8, 11.5, 11.7, 11.3] },
  { codigo: 'AAPL', nome: 'Apple Inc.', tipo: 'Ação', preco: 195.64, variacao: '+0.42%', valor: 'US$ 0,82', up: true, volume: 'NASDAQ', pl: '29.80', fav: false, fonte: 'Base local', historico: [171, 176, 180, 184, 181, 190, 193, 196] },
  { codigo: 'MSFT', nome: 'Microsoft Corporation', tipo: 'Ação', preco: 476.11, variacao: '+0.31%', valor: 'US$ 1,48', up: true, volume: 'NASDAQ', pl: '35.10', fav: false, fonte: 'Base local', historico: [410, 422, 430, 441, 450, 462, 468, 476] },
  { codigo: 'IVVB11.SA', nome: 'ETF S&P 500', tipo: 'ETF', preco: 317.40, variacao: '+0.72%', valor: 'R$ 2,26', up: true, volume: 'R$ 120M', pl: '-', fav: false, fonte: 'Base local', historico: [285, 292, 300, 304, 309, 312, 315, 317] }
];

const conteudosEducacionais = [
  { titulo: 'CDB', categoria: 'Renda Fixa', texto: 'Título emitido por bancos. Pode render um percentual do CDI e costuma ter proteção do FGC dentro dos limites oficiais.' },
  { titulo: 'CDI', categoria: 'Indicador', texto: 'Taxa usada como referência para muitos investimentos de renda fixa. Quando um CDB rende 100% do CDI, ele acompanha esse índice.' },
  { titulo: 'Ações', categoria: 'Renda Variável', texto: 'Pequenas partes de uma empresa negociadas na bolsa. Podem valorizar, desvalorizar e pagar dividendos.' },
  { titulo: 'Debêntures', categoria: 'Crédito Privado', texto: 'Títulos de dívida emitidos por empresas. Podem pagar mais que renda fixa tradicional, mas também têm mais risco.' },
  { titulo: 'Títulos Públicos', categoria: 'Tesouro Direto', texto: 'Investimentos emitidos pelo governo, como Tesouro Selic, Prefixado e IPCA+. São usados para objetivos de prazos diferentes.' },
  { titulo: 'Renda Variável', categoria: 'Conceito', texto: 'Investimentos sem rentabilidade garantida. O preço muda conforme mercado, empresas, juros, cenário econômico e expectativas.' },
  { titulo: 'Previdência Privada', categoria: 'Planejamento', texto: 'Produto voltado para objetivos de longo prazo, como aposentadoria. Pode ser PGBL ou VGBL e tem regras próprias de tributação.' },
  { titulo: 'Aporte', categoria: 'Conceito', texto: 'Valor que o investidor adiciona a um investimento. Aportes mensais ajudam a criar disciplina e aumentam o efeito dos juros compostos.' },
  { titulo: 'Compra de ativos', categoria: 'Bolsa', texto: 'A compra ocorre quando o investidor envia uma ordem pela corretora para adquirir ações, ETFs, fundos imobiliários ou outros ativos negociados.' },
  { titulo: 'Venda de ativos', categoria: 'Bolsa', texto: 'A venda ocorre quando o investidor envia uma ordem para se desfazer de um ativo. O preço final depende da oferta e da demanda no mercado.' },
  { titulo: 'Liquidar um ativo', categoria: 'Bolsa', texto: 'Liquidar é concluir financeiramente uma operação. Depois da negociação, a bolsa e a corretora processam a entrega do ativo e do dinheiro.' },
  { titulo: 'Negociar na bolsa', categoria: 'Bolsa', texto: 'Negociar é enviar ordens de compra ou venda em ambiente organizado. A operação só acontece quando existe contraparte pelo preço aceito.' },
  { titulo: 'Corretora', categoria: 'Intermediário', texto: 'Instituição que conecta o investidor ao mercado. É por ela que o usuário abre conta, transfere recursos e envia ordens.' },
  { titulo: 'Ordem limitada', categoria: 'Bolsa', texto: 'Ordem em que o investidor define o preço máximo para comprar ou o preço mínimo para vender. Dá mais controle, mas pode não executar.' },
  { titulo: 'Ordem a mercado', categoria: 'Bolsa', texto: 'Ordem executada pelo melhor preço disponível naquele momento. É rápida, mas o preço final pode variar.' },
  { titulo: 'Dividendos', categoria: 'Proventos', texto: 'Parte do lucro distribuída por algumas empresas aos acionistas. Não é garantido e depende do resultado e da política da companhia.' },
  { titulo: 'Diversificação', categoria: 'Risco', texto: 'Estratégia de dividir o dinheiro entre diferentes ativos e classes para reduzir dependência de um único investimento.' },
  { titulo: 'Liquidez', categoria: 'Conceito', texto: 'Facilidade de transformar um investimento em dinheiro. Ativos com alta liquidez costumam ser vendidos mais rapidamente.' }
];

const noticiasEducacionais = [
  { titulo: 'Mercado acompanha juros e resultados corporativos', fonte: 'Resumo educacional', data: 'Conteúdo interno', texto: 'Investidores observam balanços, inflação e decisões de juros para avaliar empresas e setores.', link: '' },
  { titulo: 'Bancos seguem no radar de investidores', fonte: 'Resumo educacional', data: 'Conteúdo interno', texto: 'Empresas como Itaú, Bradesco e Banco do Brasil costumam ser acompanhadas por lucro, inadimplência e dividendos.', link: '' },
  { titulo: 'Simuladores ajudam a visualizar objetivos', fonte: 'Educação financeira', data: 'Conteúdo interno', texto: 'A simulação não promete retorno, mas mostra como prazo, aportes e taxa estimada mudam o resultado final.', link: '' }
];

const knownAssets = new Map(ativosBase.map((ativo) => [ativo.codigo, ativo]));

function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

function qsa(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

function getToken() {
  return localStorage.getItem('token');
}

function getNomeUsuario() {
  return localStorage.getItem('nome') || 'Investidor';
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`
  };
}

function formatMoney(value) {
  const number = Number(value || 0);
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function setMessage(text, type = 'info') {
  const message = qs('#mensagem');
  if (!message) return;
  message.textContent = text;
  message.dataset.type = type;
}

function normalizeSearch(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function normalizarAtivo(ativo) {
  const historico = ativo.historico && ativo.historico.length
    ? ativo.historico
    : gerarHistorico(Number(ativo.preco || 0), Boolean(ativo.up));

  const normalized = {
    codigo: ativo.codigo || ativo.symbol,
    nome: ativo.nome || ativo.name || ativo.codigo || ativo.symbol,
    tipo: ativo.tipo || 'Ativo',
    preco: Number(ativo.preco || 0),
    variacao: ativo.variacao || '0.00%',
    valor: ativo.valor || 'R$ 0,00',
    up: ativo.up !== false,
    volume: ativo.volume || ativo.fonte || 'Mercado',
    pl: ativo.pl || '-',
    fonte: ativo.fonte || 'Yahoo Finance',
    historico,
    fav: isFavorited(ativo.codigo || ativo.symbol)
  };

  knownAssets.set(normalized.codigo, normalized);
  return normalized;
}

function gerarHistorico(preco, up = true) {
  const base = preco > 0 ? preco : 50;
  const direction = up ? 1 : -1;
  return Array.from({ length: 8 }, (_, index) => {
    const wave = Math.sin(index * 1.2) * base * 0.025;
    const trend = direction * index * base * 0.012;
    return Math.max(1, base - base * 0.08 + trend + wave);
  });
}

function getFavoritos() {
  const saved = localStorage.getItem(FAVORITES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved).map(normalizarAtivo);
    } catch {
      localStorage.removeItem(FAVORITES_KEY);
    }
  }
  const iniciais = ativosBase.filter((ativo) => ativo.fav).map(normalizarAtivo);
  saveFavoritos(iniciais);
  return iniciais;
}

function saveFavoritos(favoritos) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritos));
}

function isFavorited(codigo) {
  if (!codigo) return false;
  const saved = localStorage.getItem(FAVORITES_KEY);
  if (!saved) return ativosBase.some((ativo) => ativo.codigo === codigo && ativo.fav);
  try {
    return JSON.parse(saved).some((ativo) => ativo.codigo === codigo);
  } catch {
    return false;
  }
}

function toggleFavorito(codigo) {
  const favoritos = getFavoritos();
  const exists = favoritos.some((ativo) => ativo.codigo === codigo);
  const next = exists
    ? favoritos.filter((ativo) => ativo.codigo !== codigo)
    : [...favoritos, normalizarAtivo(knownAssets.get(codigo) || { codigo, nome: codigo, tipo: 'Ativo' })];
  saveFavoritos(next);
  return !exists;
}

function miniChart(historico, up = true) {
  const values = historico.length ? historico : gerarHistorico(50, up);
  const width = 150;
  const height = 54;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((value, index) => {
    const x = (width / (values.length - 1)) * index;
    const y = height - ((value - min) / range) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return `
    <svg class="mini-chart ${up ? '' : 'down-chart'}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Mini gráfico do ativo">
      <polyline points="${points}" fill="none"></polyline>
      <circle cx="${width}" cy="${points.split(' ').pop().split(',')[1]}" r="3"></circle>
    </svg>
  `;
}

function cardAtivo(ativo) {
  const asset = normalizarAtivo(ativo);
  const favorited = isFavorited(asset.codigo);

  return `
    <article class="asset-card" data-symbol="${asset.codigo}">
      <button class="star-button ${favorited ? 'active' : ''}" type="button" data-favorite-symbol="${asset.codigo}" title="${favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
        ${favorited ? '★' : '☆'}
      </button>
      <h3>${asset.codigo}<span class="tag">${asset.tipo}</span></h3>
      <p class="name">${asset.nome}</p>
      ${miniChart(asset.historico, asset.up)}
      <div class="price">${formatMoney(asset.preco)}</div>
      <span class="${asset.up ? 'up' : 'down'}">${asset.up ? '↗' : '↘'} ${asset.valor} (${asset.variacao})</span>
      <hr>
      <div class="asset-details">
        <p>Fonte<strong>${asset.fonte}</strong></p>
        <p>P/L<strong>${asset.pl}</strong></p>
      </div>
    </article>
  `;
}

function bindFavoriteButtons(onChange) {
  qsa('[data-favorite-symbol]').forEach((button) => {
    button.addEventListener('click', () => {
      const active = toggleFavorito(button.dataset.favoriteSymbol);
      button.classList.toggle('active', active);
      button.textContent = active ? '★' : '☆';
      button.title = active ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
      if (onChange) onChange();
    });
  });
}

function drawMarketReferenceChart() {
  const canvas = qs('#marketChart');
  if (!canvas) return;

  const data = [
    { ano: 2019, valor: 116, investidores: 1.7 },
    { ano: 2020, valor: 119, investidores: 3.2 },
    { ano: 2021, valor: 105, investidores: 4.2 },
    { ano: 2022, valor: 110, investidores: 5.0 },
    { ano: 2023, valor: 134, investidores: 5.8 },
    { ano: 2024, valor: 120, investidores: 6.2 },
    { ano: 2025, valor: 128, investidores: 6.9 },
    { ano: 2026, valor: 136, investidores: 7.4 }
  ];

  const context = canvas.getContext('2d');
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.width = canvas.offsetWidth * ratio;
  const height = canvas.height = canvas.offsetHeight * ratio;
  const left = 58 * ratio;
  const right = 58 * ratio;
  const top = 24 * ratio;
  const bottom = 44 * ratio;
  const plotW = width - left - right;
  const plotH = height - top - bottom;

  context.clearRect(0, 0, width, height);
  context.font = `${12 * ratio}px Inter, Arial`;
  context.lineWidth = 1 * ratio;
  context.strokeStyle = '#dbe3ee';
  context.fillStyle = '#536988';

  for (let i = 0; i <= 4; i += 1) {
    const y = top + (plotH / 4) * i;
    context.beginPath();
    context.moveTo(left, y);
    context.lineTo(width - right, y);
    context.stroke();

    const valorLabel = Math.round(140 - (40 / 4) * i);
    const investidorLabel = (8 - (8 / 4) * i).toFixed(0);
    context.fillText(`${valorLabel}k`, 12 * ratio, y + 4 * ratio);
    context.fillText(`${investidorLabel} mi`, width - right + 12 * ratio, y + 4 * ratio);
  }

  function x(index) {
    return left + (plotW / (data.length - 1)) * index;
  }

  function yValor(value) {
    return top + ((140 - value) / 40) * plotH;
  }

  function yInvestidores(value) {
    return top + ((8 - value) / 8) * plotH;
  }

  function drawSeries(values, yFn, color) {
    context.strokeStyle = color;
    context.lineWidth = 3 * ratio;
    context.beginPath();
    values.forEach((item, index) => {
      const px = x(index);
      const py = yFn(item);
      if (index === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    });
    context.stroke();
  }

  drawSeries(data.map((item) => item.valor), yValor, '#02a94e');
  drawSeries(data.map((item) => item.investidores), yInvestidores, '#2563eb');

  context.fillStyle = '#020617';
  data.forEach((item, index) => {
    context.fillText(String(item.ano), x(index) - 13 * ratio, height - 16 * ratio);
  });

  context.fillStyle = '#536988';
  context.fillText('Valor do índice (mil pontos)', left, 14 * ratio);
  context.fillText('Investidores (milhões)', width - right - 132 * ratio, 14 * ratio);
}

function drawLineChart(canvasId, values, color = '#2563eb') {
  const canvas = qs(`#${canvasId}`);
  if (!canvas) return;

  const context = canvas.getContext('2d');
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.width = canvas.offsetWidth * ratio;
  const height = canvas.height = canvas.offsetHeight * ratio;
  const padding = 28 * ratio;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  context.clearRect(0, 0, width, height);
  context.lineWidth = 1 * ratio;
  context.strokeStyle = '#dbe3ee';

  for (let i = 0; i < 4; i += 1) {
    const y = padding + ((height - padding * 2) / 3) * i;
    context.beginPath();
    context.moveTo(padding, y);
    context.lineTo(width - padding, y);
    context.stroke();
  }

  context.strokeStyle = color;
  context.lineWidth = 3 * ratio;
  context.beginPath();
  values.forEach((value, index) => {
    const x = padding + ((width - padding * 2) / (values.length - 1)) * index;
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();
}

async function buscarAtivosExternos(termo) {
  if (!termo) return ativosBase.map(normalizarAtivo);

  try {
    const response = await fetch(`${API}/mercado/ativos?q=${encodeURIComponent(termo)}`);
    const data = await response.json();
    latestAssetsSource = data.fonte || 'API de mercado';
    if (!response.ok) throw new Error(data.erro || 'Erro na API de mercado');
    return (data.ativos || []).map(normalizarAtivo);
  } catch {
    latestAssetsSource = 'Base local';
    const lower = termo.toLowerCase();
    return ativosBase.filter((ativo) => (
      normalizeSearch(ativo.codigo).includes(normalizeSearch(lower)) ||
      normalizeSearch(ativo.nome).includes(normalizeSearch(lower))
    )).map(normalizarAtivo);
  }
}

function initCommon() {
  qsa('.app-topbar .avatar').forEach((avatar) => {
    avatar.textContent = getNomeUsuario().charAt(0).toUpperCase();
    if (!avatar.dataset.bound) {
      avatar.dataset.bound = 'true';
      avatar.addEventListener('click', () => { window.location.href = 'perfil.html'; });
    }
  });

  qsa('.search-top input').forEach((input) => {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && input.value.trim()) {
        window.location.href = `pesquisar.html?q=${encodeURIComponent(input.value.trim())}`;
      }
    });
  });
}

async function renderDashboard() {
  const favoritos = qs('#favoritosHome');
  const populares = qs('#popularesHome');
  const news = qs('#noticiasHome');
  const greeting = qs('#dashboardGreeting');

  if (greeting) greeting.textContent = `Bem-vindo, ${getNomeUsuario()}`;
  if (favoritos) favoritos.innerHTML = getFavoritos().map(cardAtivo).join('');
  if (populares) populares.innerHTML = ativosBase.slice(0, 6).map(cardAtivo).join('');
  if (news) {
    news.innerHTML = noticiasEducacionais.slice(0, 2).map((noticia) => `
      <article class="news-card">
        <span>${noticia.fonte}</span>
        <h3>${noticia.titulo}</h3>
        <p>${noticia.texto}</p>
      </article>
    `).join('');
  }

  drawMarketReferenceChart();
  bindFavoriteButtons(() => renderDashboard());
  refreshIcons();
}

async function renderPesquisar() {
  const lista = qs('#listaAtivos');
  const busca = qs('#buscaAtivo');
  const total = qs('#totalAtivos');
  const filtros = qsa('[data-filter]');
  const source = qs('#fonteAtivos');
  const params = new URLSearchParams(window.location.search);
  let filtroAtual = 'todos';
  let timer = null;

  if (!lista || !busca || !total) return;
  busca.value = params.get('q') || '';

  async function render() {
    const termo = busca.value.trim();
    lista.innerHTML = '<p class="empty-state">Buscando ativos...</p>';
    const encontrados = await buscarAtivosExternos(termo);
    const filtrados = encontrados.filter((ativo) => {
      const bateFiltro = filtroAtual === 'todos' || ativo.tipo.toLowerCase().includes(filtroAtual);
      return bateFiltro;
    });

    total.textContent = filtrados.length;
    if (source) source.textContent = termo ? `Fonte: ${latestAssetsSource}` : 'Fonte: base demonstrativa local';
    lista.innerHTML = filtrados.map(cardAtivo).join('') || '<p class="empty-state">Nenhum ativo encontrado.</p>';
    bindFavoriteButtons(() => renderFavoritos());
    refreshIcons();
  }

  filtros.forEach((button) => {
    button.addEventListener('click', () => {
      filtroAtual = button.dataset.filter;
      filtros.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      render();
    });
  });

  busca.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(render, 450);
  });
  await render();
}

function renderFavoritos() {
  const lista = qs('#listaFavoritos');
  if (!lista) return;
  const favoritos = getFavoritos();
  lista.innerHTML = favoritos.map(cardAtivo).join('') || '<p class="empty-state">Nenhum favorito salvo.</p>';
  bindFavoriteButtons(() => renderFavoritos());
  refreshIcons();
}

function renderEducacao() {
  const lista = qs('#listaEducacao');
  const busca = qs('#buscaEducacao');
  if (!lista) return;

  function render() {
    const termo = normalizeSearch(busca?.value || '');
    const filtrados = conteudosEducacionais.filter((item) => (
      normalizeSearch(item.titulo).includes(termo) ||
      normalizeSearch(item.categoria).includes(termo) ||
      normalizeSearch(item.texto).includes(termo)
    ));

    lista.innerHTML = filtrados.map((item) => `
      <article class="content-card">
        <span>${item.categoria}</span>
        <h3>${item.titulo}</h3>
        <p>${item.texto}</p>
      </article>
    `).join('') || '<p class="empty-state">Nenhum conteúdo encontrado.</p>';
  }

  busca?.addEventListener('input', render);
  render();
}

async function buscarNoticias(termo) {
  try {
    const response = await fetch(`${API}/mercado/noticias?q=${encodeURIComponent(termo || 'mercado financeiro')}`);
    const data = await response.json();
    return data.noticias || [];
  } catch {
    const lower = String(termo || '').toLowerCase();
    return noticiasEducacionais.filter((noticia) => (
      !lower ||
      normalizeSearch(noticia.titulo).includes(normalizeSearch(lower)) ||
      normalizeSearch(noticia.texto).includes(normalizeSearch(lower))
    ));
  }
}

async function renderNoticias() {
  const lista = qs('#listaNoticias');
  const busca = qs('#buscaNoticias');
  const form = qs('#formNoticias');
  const fonte = qs('#fonteNoticias');
  if (!lista) return;

  async function render(termo = busca?.value || 'mercado financeiro') {
    lista.innerHTML = '<p class="empty-state">Buscando notícias...</p>';
    const noticias = await buscarNoticias(termo);
    if (fonte) fonte.textContent = termo ? `Busca: ${termo} | Fonte: Google News RSS via backend` : 'Fonte: Google News RSS via backend';
    lista.innerHTML = noticias.map((noticia) => `
      <article class="news-card large">
        <span>${noticia.fonte} • ${noticia.data}</span>
        <h3>${noticia.titulo}</h3>
        <p>${noticia.texto}</p>
        ${noticia.link ? `<a class="news-link" href="${noticia.link}" target="_blank" rel="noopener">Abrir notícia</a>` : ''}
      </article>
    `).join('') || '<p class="empty-state">Nenhuma notícia encontrada.</p>';
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    render(busca.value.trim());
  });
  await render();
}

function renderIA() {
  const form = qs('#formIA');
  const pergunta = qs('#perguntaIA');
  const resposta = qs('#respostaIA');
  if (!form || !pergunta || !resposta) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    resposta.innerHTML = '<p class="muted">Consultando IA...</p>';

    try {
      const response = await fetch(`${API}/ia/perguntar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta: pergunta.value })
      });
      const data = await response.json();
      resposta.innerHTML = `<p>${(data.resposta || data.erro || 'Não foi possível responder agora.').replace(/\n/g, '<br>')}</p>`;
    } catch {
      resposta.innerHTML = '<p>Não foi possível conectar ao servidor da IA.</p>';
    }
  });
}

function renderSimulador() {
  const form = qs('#formSimulador');
  const resultado = qs('#resultadoSimulador');
  if (!form || !resultado) return;

  function calcular(event) {
    event.preventDefault();
    const inicial = Number(qs('#valorInicial').value || 0);
    const aporte = Number(qs('#aporteMensal').value || 0);
    const taxaAnual = Number(qs('#taxaAnual').value || 0) / 100;
    const meses = Number(qs('#periodoMeses').value || 0);
    const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;
    const pontos = [];
    let total = inicial;

    for (let mes = 1; mes <= meses; mes += 1) {
      total = total * (1 + taxaMensal) + aporte;
      if (mes % Math.max(1, Math.floor(meses / 8)) === 0 || mes === meses) pontos.push(total);
    }

    const aportado = inicial + aporte * meses;
    const rendimento = total - aportado;
    resultado.innerHTML = `
      <div><span>Total estimado</span><strong>${formatMoney(total)}</strong></div>
      <div><span>Valor aportado</span><strong>${formatMoney(aportado)}</strong></div>
      <div><span>Rendimento estimado</span><strong>${formatMoney(rendimento)}</strong></div>
    `;
    drawLineChart('simuladorChart', pontos.length > 1 ? pontos : [inicial, total], '#2563eb');
  }

  form.addEventListener('submit', calcular);
  form.dispatchEvent(new Event('submit'));
}

async function carregarPerfil() {
  const token = getToken();
  const perfilNome = qs('#perfilNome');
  const perfilEmail = qs('#perfilEmail');
  const nomePerfil = qs('#nomePerfil');
  const emailPerfil = qs('#emailPerfil');
  const telefonePerfil = qs('#telefonePerfil');

  if (!token) {
    if (perfilNome) perfilNome.textContent = 'Visitante';
    if (perfilEmail) perfilEmail.textContent = 'Faça login para carregar seu perfil';
    return;
  }

  try {
    const response = await fetch(`${API}/usuario`, { headers: authHeaders() });
    const usuario = await response.json();
    if (!response.ok) throw new Error(usuario.erro);

    if (perfilNome) perfilNome.textContent = usuario.nome;
    if (perfilEmail) perfilEmail.textContent = usuario.email;
    if (nomePerfil) nomePerfil.value = usuario.nome;
    if (emailPerfil) emailPerfil.value = usuario.email;
    if (telefonePerfil) telefonePerfil.value = usuario.telefone || '';
    localStorage.setItem('nome', usuario.nome);
    qsa('.avatar.big').forEach((avatar) => { avatar.textContent = usuario.nome.charAt(0).toUpperCase(); });
    initCommon();
  } catch (err) {
    if (perfilEmail) perfilEmail.textContent = err.message || 'Não foi possível carregar o perfil.';
  }
}

function habilitarEdicaoPerfil() {
  const button = qs('#btnEditarPerfil');
  const nomePerfil = qs('#nomePerfil');
  const telefonePerfil = qs('#telefonePerfil');
  if (!button || !nomePerfil) return;

  button.addEventListener('click', async () => {
    if (nomePerfil.disabled) {
      nomePerfil.disabled = false;
      if (telefonePerfil) telefonePerfil.disabled = false;
      button.textContent = 'Salvar Perfil';
      nomePerfil.focus();
      return;
    }

    try {
      const response = await fetch(`${API}/usuario`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ nome: nomePerfil.value, telefone: telefonePerfil ? telefonePerfil.value : '', foto: '' })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.erro);
      localStorage.setItem('nome', nomePerfil.value);
      button.textContent = 'Editar Perfil';
      nomePerfil.disabled = true;
      if (telefonePerfil) telefonePerfil.disabled = true;
      await carregarPerfil();
    } catch (err) {
      alert(err.message || 'Não foi possível atualizar o perfil.');
    }
  });
}

async function renderCarteira() {
  const form = qs('#formInvestimento');
  const lista = qs('#listaInvestimentos');
  const total = qs('#totalCarteira');
  const dataInput = qs('#dataInvestimento');
  if (!form || !lista) return;
  if (dataInput && !dataInput.value) dataInput.value = new Date().toISOString().slice(0, 10);

  async function carregarInvestimentos() {
    if (!getToken()) {
      lista.innerHTML = '<p class="empty-state">Faça login para cadastrar investimentos.</p>';
      return;
    }

    const response = await fetch(`${API}/investimentos`, { headers: authHeaders() });
    const investimentos = await response.json();
    if (!response.ok) {
      lista.innerHTML = `<p class="empty-state">${investimentos.erro || 'Erro ao carregar investimentos.'}</p>`;
      return;
    }

    const soma = investimentos.reduce((acc, item) => acc + Number(item.valor), 0);
    if (total) total.textContent = formatMoney(soma);
    lista.innerHTML = investimentos.map((item) => `
      <article class="investment-row">
        <div><strong>${item.tipo}</strong><p>${item.descricao || 'Sem descrição'} • ${item.data_inicio}</p></div>
        <span>${formatMoney(item.valor)}</span>
        <button class="icon-button" data-delete="${item.id}" title="Excluir investimento"><i data-lucide="trash-2"></i></button>
      </article>
    `).join('') || '<p class="empty-state">Nenhum investimento cadastrado ainda.</p>';

    qsa('[data-delete]').forEach((button) => {
      button.addEventListener('click', async () => {
        await fetch(`${API}/investimentos/${button.dataset.delete}`, { method: 'DELETE', headers: authHeaders() });
        await carregarInvestimentos();
      });
    });
    refreshIcons();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!getToken()) {
      setMessage('Faça login para cadastrar investimentos.', 'error');
      return;
    }

    const body = {
      tipo: qs('#tipoInvestimento').value,
      valor: qs('#valorInvestimento').value,
      data_inicio: qs('#dataInvestimento').value,
      descricao: qs('#descricaoInvestimento').value
    };

    const response = await fetch(`${API}/investimentos`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body)
    });
    const data = await response.json();
    setMessage(data.mensagem || data.erro, response.ok ? 'success' : 'error');
    if (response.ok) {
      form.reset();
      await carregarInvestimentos();
    }
  });

  await carregarInvestimentos();
}

function deletarConta() {
  localStorage.clear();
  window.location.href = 'login.html';
}

const formCadastro = qs('#formCadastro');
const formLogin = qs('#formLogin');

if (formCadastro) {
  formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();
    const nome = qs('#nome').value.trim();
    const email = qs('#email').value.trim();
    const senha = qs('#senha').value;
    const confirmar = qs('#confirmarSenha').value;

    if (senha !== confirmar) {
      setMessage('As senhas não conferem.', 'error');
      return;
    }

    try {
      const response = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });
      const data = await response.json();
      const codigoDev = data.codigoDesenvolvimento ? ` Código de teste: ${data.codigoDesenvolvimento}` : '';
      setMessage(`${data.mensagem || data.erro || ''}${codigoDev}`, response.ok ? 'success' : 'error');
      if (response.ok) setTimeout(() => { window.location.href = 'login.html'; }, 1800);
    } catch {
      setMessage('Não foi possível conectar ao servidor.', 'error');
    }
  });
}

if (formLogin) {
  formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      const email = qs('#email').value.trim();
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: qs('#senha').value })
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.emailPendente) {
          sessionStorage.setItem('emailPendente', data.email || email);
          qs('#emailValidationBox')?.removeAttribute('hidden');
          const codigoDev = data.codigoDesenvolvimento ? ` Código de teste: ${data.codigoDesenvolvimento}` : '';
          setMessage(`${data.erro}${codigoDev}`, 'error');
          return;
        }
        setMessage(data.erro || 'Não foi possível entrar.', 'error');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('nome', data.nome);
      window.location.href = 'dashboard.html';
    } catch {
      setMessage('Não foi possível conectar ao servidor.', 'error');
    }
  });
}

qs('#btnValidarEmail')?.addEventListener('click', async () => {
  const email = sessionStorage.getItem('emailPendente') || qs('#email')?.value.trim();
  const codigo = qs('#codigoEmail')?.value.trim();

  const response = await fetch(`${API}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, codigo })
  });
  const data = await response.json();
  setMessage(data.mensagem || data.erro, response.ok ? 'success' : 'error');
  if (response.ok) qs('#emailValidationBox')?.setAttribute('hidden', 'hidden');
});

qs('#btnReenviarCodigo')?.addEventListener('click', async () => {
  const email = sessionStorage.getItem('emailPendente') || qs('#email')?.value.trim();
  const response = await fetch(`${API}/auth/resend-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await response.json();
  const codigoDev = data.codigoDesenvolvimento ? ` Código de teste: ${data.codigoDesenvolvimento}` : '';
  setMessage(`${data.mensagem || data.erro || ''}${codigoDev}`, response.ok ? 'success' : 'error');
});

function renderRecuperarSenha() {
  const formEmail = qs('#formRecuperarEmail');
  const formSenha = qs('#formNovaSenha');
  if (!formEmail || !formSenha) return;

  formEmail.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = qs('#emailRecuperacao').value.trim();
    const response = await fetch(`${API}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    const codigoDev = data.codigoDesenvolvimento ? ` Código de teste: ${data.codigoDesenvolvimento}` : '';
    setMessage(`${data.mensagem || data.erro || ''}${codigoDev}`, response.ok ? 'success' : 'error');
    if (response.ok) formSenha.removeAttribute('hidden');
  });

  formSenha.addEventListener('submit', async (event) => {
    event.preventDefault();
    const response = await fetch(`${API}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: qs('#emailRecuperacao').value.trim(),
        codigo: qs('#codigoRecuperacao').value.trim(),
        novaSenha: qs('#novaSenha').value
      })
    });
    const data = await response.json();
    setMessage(data.mensagem || data.erro, response.ok ? 'success' : 'error');
    if (response.ok) setTimeout(() => { window.location.href = 'login.html'; }, 1200);
  });
}

window.renderDashboard = renderDashboard;
window.renderPesquisar = renderPesquisar;
window.renderFavoritos = renderFavoritos;
window.renderEducacao = renderEducacao;
window.renderNoticias = renderNoticias;
window.renderSimulador = renderSimulador;
window.renderCarteira = renderCarteira;
window.renderRecuperarSenha = renderRecuperarSenha;
window.renderIA = renderIA;
window.carregarPerfil = carregarPerfil;
window.habilitarEdicaoPerfil = habilitarEdicaoPerfil;
window.deletarConta = deletarConta;

document.addEventListener('DOMContentLoaded', initCommon);
