# Organização do Projeto

Este documento resume o que estava faltando, o que foi padronizado e como apresentar a divisão de trabalho da equipe.

## O que faltava

- Script de inicialização no `backend/package.json`.
- Arquivo `.env.example` para explicar variáveis de ambiente.
- Script SQL para criar o banco MySQL.
- Alternativa simples de banco para rodar sem configurar MySQL na apresentação.
- Páginas que eram citadas no planejamento, mas não existiam: favoritos, simulador, educação e notícias.
- Tela para demonstrar CRUD de investimentos.
- Busca realista de ativos externos, incluindo ativos internacionais como Apple.
- Busca de notícias por empresa ou ticker.
- Busca na área educacional.
- Validação de e-mail e recuperação de senha por código.
- Tela de IA financeira para dúvidas dos usuários.
- Rotas duplicadas em investimentos.
- README explicando como rodar, estrutura, API e responsabilidades.
- Navegação completa entre as telas.

## O que foi organizado

- Backend agora serve a API e também o frontend em `http://localhost:3000`.
- Banco padrão é MySQL para salvar cadastros na tabela `usuarios`.
- JSON local continua disponível apenas se `DB_CLIENT=json`.
- JavaScript do frontend foi separado em funções por tela.
- Telas receberam navegação padronizada.
- Conteúdo educacional foi centralizado em uma tela própria.
- O CRUD ficou visível na tela `carteira.html`.
- Ativos e notícias agora passam por rotas próprias no backend em `backend/src/routes/mercadoRoutes.js`.
- A IA passa por `backend/src/routes/iaRoutes.js` e usa `OPENAI_API_KEY`.
- O login exige validação de e-mail por código antes de liberar o acesso.

## Entrega mínima para apresentação

- Login.
- Cadastro.
- Dashboard.
- Gráfico demonstrativo.
- Simulador.
- Conteúdo educacional.
- Notícias educativas.
- CRUD de investimentos.
- Busca e favoritos.
- Pesquisa de ativos externos.
- Pesquisa de notícias.
- Pesquisa em educação.
- Validação de e-mail e recuperação de senha.
- IA financeira.

## Responsabilidades

### Duda - P.O, organização, conteúdo e banco

- Validar se as telas seguem a proposta do Simple Invest.
- Organizar backlog e prioridades.
- Revisar textos educacionais.
- Conferir se a estrutura do banco atende usuários e investimentos.

### João - JavaScript e lógica

- Manter `frontend/js/script.js`.
- Cuidar de simulador, gráficos, busca externa, favoritos e integrações com API.
- Garantir que cada tela inicialize apenas a função que precisa.

### Ronie - Front-end/UI

- Manter HTML e CSS.
- Cuidar de layout, responsividade, espaçamento e visual limpo.
- Garantir navegação clara entre as telas.

### Cauã - Back-end, banco e API

- Manter `backend/src`.
- Cuidar de login, cadastro, JWT, CRUD e banco.
- Cuidar de validação de e-mail, recuperação de senha, rotas de mercado e envio de códigos.
- Cuidar da rota de IA e das variáveis `OPENAI_API_KEY` e `OPENAI_MODEL`.
- Validar rotas protegidas e dados por usuário.

## Checklist antes da apresentação

- Rodar `npm install` dentro de `backend`.
- Criar o banco com `backend/database/schema.sql`.
- Conferir se `backend/.env` está com `DB_CLIENT=mysql`.
- Rodar `npm start`.
- Abrir `http://localhost:3000`.
- Criar uma conta nova.
- Fazer login.
- Abrir Dashboard, Simulador, Educação, Notícias e Carteira.
- Testar pesquisa de ativo com `apple` e `itau`.
- Testar pesquisa de notícias com `itau`.
- Testar pesquisa educacional com `aporte`, `previdência` e `liquidar`.
- Cadastrar e excluir um investimento na Carteira.
