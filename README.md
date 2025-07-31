# URL Shortener API

API para encurtamento de URLs desenvolvida em Node.js com Express e PostgreSQL.

## 🚀 Funcionalidades

- Encurtar URLs com geração automática de código único
- Buscar URL original por ID
- Listar URLs encurtadas por data específica
- Buscar URL original pelo código encurtado
- Redirecionamento automático para URL original
- Contador de cliques
- Validação completa de dados
- Tratamento de erros

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- PostgreSQL (v12 ou superior)
- npm ou yarn

## 🛠️ Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente no arquivo `.env`:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=urlshortener
DB_USER=postgres
DB_PASSWORD=sua_senha
BASE_URL=http://localhost:3000
```

3. Execute as migrações do banco:
```bash
npm run migrate
```

## 🏃‍♂️ Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

A API estará disponível em `http://localhost:3000`

## 📚 Endpoints da API

### 🔗 Encurtar URL
**POST** `/api/shorten`

**Body:**
```json
{
  "originalUrl": "https://www.exemplo.com.br/pagina-muito-longa"
}
```

**Response:**
```json
{
  "success": true,
  "message": "URL encurtada com sucesso",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "originalUrl": "https://www.exemplo.com.br/pagina-muito-longa",
    "shortUrl": "http://localhost:3000/abc123",
    "urlCode": "abc123",
    "clicks": 0,
    "createdAt": "2025-07-30T15:30:00.000Z"
  }
}
```

### 🆔 Buscar URL por ID
**GET** `/api/url/:id`

**Response:**
```json
{
  "success": true,
  "message": "URL encontrada",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "originalUrl": "https://www.exemplo.com.br",
    "shortUrl": "http://localhost:3000/abc123",
    "urlCode": "abc123",
    "clicks": 5,
    "createdAt": "2025-07-30T15:30:00.000Z"
  }
}
```

### 📅 Listar URLs por Data
**GET** `/api/urls/date/:date`

Formato da data: `YYYY-MM-DD` (ex: `2025-07-30`)

**Response:**
```json
{
  "success": true,
  "message": "URLs encontradas para 2025-07-30",
  "count": 2,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "originalUrl": "https://www.exemplo1.com",
      "shortUrl": "http://localhost:3000/abc123",
      "urlCode": "abc123",
      "clicks": 10,
      "createdAt": "2025-07-30T15:30:00.000Z"
    },
    {
      "id": "b2c3d4e5-f6g7-8901-bcde-f23456789012",
      "originalUrl": "https://www.exemplo2.com",
      "shortUrl": "http://localhost:3000/def456",
      "urlCode": "def456",
      "clicks": 3,
      "createdAt": "2025-07-30T10:15:00.000Z"
    }
  ]
}
```

### 🔍 Buscar URL por Código
**GET** `/api/code/:code`

**Response:**
```json
{
  "success": true,
  "message": "URL encontrada",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "originalUrl": "https://www.exemplo.com",
    "shortUrl": "http://localhost:3000/abc123",
    "urlCode": "abc123",
    "clicks": 15,
    "createdAt": "2025-07-30T15:30:00.000Z"
  }
}
```

### 🔀 Redirecionamento
**GET** `/:code`

Redireciona automaticamente para a URL original e incrementa o contador de cliques.

### 🏥 Health Check
**GET** `/health`

**Response:**
```json
{
  "success": true,
  "message": "API funcionando corretamente",
  "timestamp": "2025-07-30T15:30:00.000Z"
}
```

## 🗂️ Estrutura do Projeto

```
src/
├── config/
│   └── database.js          # Configuração do PostgreSQL
├── controllers/
│   └── urlController.js     # Lógica de negócio
├── middleware/
│   └── validation.js        # Validações de entrada
├── models/
│   └── Url.js              # Modelo do Sequelize
├── routes/
│   └── urlRoutes.js        # Definição das rotas
├── scripts/
│   └── migrate.js          # Script de migração
└── server.js               # Servidor principal
```

## 🧪 Testando a API

### Usando curl:

```bash
# Encurtar uma URL
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://www.google.com"}'

# Buscar por ID
curl http://localhost:3000/api/url/UUID_AQUI

# Buscar por data
curl http://localhost:3000/api/urls/date/2025-07-30

# Buscar por código
curl http://localhost:3000/api/code/abc123

# Testar redirecionamento
curl -L http://localhost:3000/abc123
```

## 🐛 Troubleshooting

### Erro de conexão com PostgreSQL
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`

### Tabelas não criadas
- Execute: `npm run migrate`
- Verifique as permissões do usuário no PostgreSQL

## 🔒 Segurança

- Validação de URLs com protocolos http/https
- Limitação de tamanho de URL (2048 caracteres)
- Sanitização de códigos de entrada
- Tratamento seguro de erros

## 📈 Performance

- Índices otimizados nas colunas principais
- Pool de conexões configurado
- Códigos únicos com retry automático
- Logs para monitoramento
