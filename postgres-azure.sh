# Deploy PostgreSQL usando Azure Container Instances

# 1. Criar container PostgreSQL
az container create \
  --resource-group rg-urlshortener \
  --name postgres-urlshortener \
  --image postgres:14 \
  --dns-name-label postgres-urlshortener \
  --ports 5432 \
  --environment-variables \
    POSTGRES_DB=urlshortener \
    POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=uC0nd0@D3v \
  --cpu 1 \
  --memory 1

# 2. Obter IP público
az container show \
  --resource-group rg-urlshortener \
  --name postgres-urlshortener \
  --query ipAddress.fqdn
