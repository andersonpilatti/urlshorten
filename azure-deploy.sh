# Script de deploy para Azure
# Execute estes comandos no terminal

# 1. Instalar Azure CLI (se não tiver)
# No macOS: brew install azure-cli

# 2. Login no Azure
az login

# 3. Criar resource group
az group create --name rg-urlshortener --location eastus

# 4. Criar App Service Plan
az appservice plan create \
  --name plan-urlshortener \
  --resource-group rg-urlshortener \
  --sku F1 \
  --is-linux

# 5. Criar Web App
az webapp create \
  --resource-group rg-urlshortener \
  --plan plan-urlshortener \
  --name urlshortener-api-$(date +%s) \
  --runtime "NODE|18-lts"

# 6. Configurar variáveis de ambiente
az webapp config appsettings set \
  --resource-group rg-urlshortener \
  --name urlshortener-api-$(date +%s) \
  --settings \
    NODE_ENV=production \
    DB_HOST=your-postgres-server.postgres.database.azure.com \
    DB_PORT=5432 \
    DB_NAME=urlshortener \
    DB_USER=your-admin-user \
    DB_PASSWORD=your-secure-password

# 7. Deploy do código
az webapp deployment source config \
  --resource-group rg-urlshortener \
  --name urlshortener-api-$(date +%s) \
  --repo-url https://github.com/andersonpilatti/urlshorten \
  --branch main \
  --manual-integration
