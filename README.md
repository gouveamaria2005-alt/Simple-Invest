# Simple-Invest
PI 2°Semestre 

# 📈 Simple Invest

<div align="center">

Desenvolvido por:

**Cauã Carrijo • João Pedro Trevisanuto • Maria Eduarda Gouvea • Ronie Corinto**

Projeto Integrador — FATEC Franca

</div>

---

## 📖 Sobre o Projeto

O **Simple Invest** é uma plataforma web educacional desenvolvida para auxiliar investidores iniciantes na compreensão de informações financeiras e análise de investimentos.

A proposta do sistema é apresentar dados de mercado de forma simples, intuitiva e organizada, permitindo que usuários acompanhem ativos financeiros, visualizem indicadores relevantes e tenham acesso a conteúdos educativos sobre investimentos.

O projeto não realiza operações financeiras reais, mantendo foco exclusivamente educacional.

---

## 🎯 Objetivo

Facilitar o entendimento do mercado financeiro por meio de uma plataforma acessível, que apresente:

- Informações sobre ativos financeiros;
- Indicadores de mercado;
- Conteúdo educativo;
- Notícias relevantes;
- Ferramentas de pesquisa e acompanhamento de ativos.

---

## 🚀 Funcionalidades

### 👤 Usuários

- Cadastro de usuário
- Login autenticado
- Gerenciamento de perfil
- Exclusão de conta

### 📊 Investimentos

- Cadastro de investimentos
- Listagem de investimentos
- Atualização de investimentos
- Exclusão de investimentos

### 🔍 Pesquisa de Ativos

- Busca por código ou nome do ativo
- Visualização de informações financeiras
- Acompanhamento de ativos populares

### ⭐ Favoritos

- Adicionar ativos aos favoritos
- Remover favoritos
- Visualizar lista de ativos acompanhados

### 📚 Educação Financeira

- Conteúdo educativo para iniciantes
- Conceitos básicos de investimentos
- Notícias do mercado financeiro

---

## 🏗️ Arquitetura do Sistema

O projeto foi desenvolvido seguindo a arquitetura cliente-servidor:

### Front-end

Responsável pela interface gráfica e interação do usuário.

Tecnologias:

- HTML5
- CSS3
- JavaScript
- Lucide Icons

### Back-end

Responsável pelas regras de negócio e comunicação com o banco de dados.

Tecnologias:

- Node.js
- Express.js
- JWT Authentication
- BcryptJS
- MySQL2
- Dotenv
- Cors

### Banco de Dados

- MySQL

---

## 🗂️ Estrutura do Projeto

```bash
Simple-Invest/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── app.js
│   └── package.json
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── index.html
│   ├── login.html
│   ├── cadastro.html
│   ├── dashboard.html
│   ├── pesquisar.html
│   ├── favoritos.html
│   └── perfil.html
│
└── README.md
```

---

## 🔐 Segurança

O sistema utiliza:

- Criptografia de senhas com Bcrypt
- Autenticação baseada em JWT
- Controle de acesso por usuário
- Proteção de rotas privadas

---

## 📋 Requisitos Funcionais

### RF001 – Cadastro de Usuário

Permitir que novos usuários criem uma conta na plataforma.

### RF002 – Login de Usuário

Permitir autenticação utilizando e-mail e senha.

### RF003 – Pesquisa de Ativos

Permitir a busca e visualização de ativos financeiros.

---

## 📌 Regras de Negócio

### RN001 – Cadastro Único

Cada e-mail pode possuir apenas uma conta cadastrada.

### RN002 – Acesso Restrito

Somente usuários autenticados podem acessar funcionalidades privadas.

### RN003 – Caráter Educacional

O sistema não permite compra ou venda de ativos financeiros.

---

## 💻 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/simple-invest.git
```

### 2. Entrar na pasta

```bash
cd simple-invest
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Configurar variáveis de ambiente

Criar arquivo:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=simple_invest
JWT_SECRET=seu_segredo
```

### 5. Executar o servidor

```bash
npm start
```

Servidor disponível em:

```bash
http://localhost:3000
```

---

## 🎨 Protótipo

O design da plataforma foi desenvolvido com foco em:

- Simplicidade
- Facilidade de navegação
- Visualização intuitiva dos dados
- Experiência amigável para investidores iniciantes

---

## 📚 Contexto Acadêmico

Projeto desenvolvido para a disciplina de Projeto Integrador do curso de:

**Tecnologia em Desenvolvimento de Software Multiplataforma**

**FATEC Franca – Dr. Thomaz Novelino**

---

## 👥 Equipe

- Cauã Carrijo
- João Pedro Trevisanuto
- Maria Eduarda Gouvea
- Ronie Corinto

---

## 📄 Licença

Este projeto possui finalidade exclusivamente acadêmica e educacional.
