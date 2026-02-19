# 🚀 Deploy Completo - Google Sheets + Node.js + Vercel

## 📋 Visão Geral

Este guia mostra como fazer deploy da API que lê dados **direto do Google Sheets** em tempo real.

**Vantagens:**
- ✅ Dados sempre atualizados
- ✅ Financeiro continua usando Google Sheets normalmente
- ✅ Zero trabalho de exportar/importar
- ✅ Deploy automático via Git

---

## 📦 Estrutura do Projeto

```
declaracao-irpf-api/
├── api/
│   └── declaracao.js          ← API com integração Google Sheets
├── data/
│   └── Recibo_IRPF_2025.docx  ← Template Word
├── package.json                ← Dependências (google-spreadsheet)
├── vercel.json                 ← Config Vercel
├── .gitignore                  ← Ignorar credenciais
├── .env.example                ← Exemplo de variáveis
└── README.md
```

---

## 🔧 Passo 1: Preparar Projeto Localmente

### 1.1 Criar Pasta e Estrutura

```bash
# Criar pasta do projeto
mkdir declaracao-irpf-api
cd declaracao-irpf-api

# Criar estrutura
mkdir api
mkdir data
```

### 1.2 Copiar Arquivos

Copie os arquivos baixados para a estrutura:

```bash
# Renomear e mover
api_declaracao_sheets.js      → api/declaracao.js
package_sheets.json            → package.json
vercel_sheets.json             → vercel.json
Recibo_IRPF_2025.docx         → data/Recibo_IRPF_2025.docx
```

### 1.3 Criar .gitignore

Crie arquivo `.gitignore` na raiz:

```
# Dependências
node_modules/
package-lock.json

# Vercel
.vercel/

# Credenciais (NUNCA commitar!)
.env
.env.local
*.json
!package.json
!vercel.json

# Logs
*.log
npm-debug.log*

# Sistema
.DS_Store
Thumbs.db
```

### 1.4 Criar .env.example

Crie arquivo `.env.example` (template para outros devs):

```bash
# Google Sheets Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=seu-service-account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"
SPREADSHEET_ID=seu_spreadsheet_id_aqui

# Instruções:
# 1. Copie este arquivo para .env
# 2. Preencha com suas credenciais
# 3. NUNCA commite o arquivo .env
```

---

## 📊 Passo 2: Configurar Google Sheets

⚠️ **IMPORTANTE:** Faça isso ANTES de fazer deploy!

Siga o guia completo: **CONFIGURAR_GOOGLE_SHEETS.md**

**Resumo:**
1. ✅ Criar projeto no Google Cloud Console
2. ✅ Ativar Google Sheets API
3. ✅ Criar Service Account
4. ✅ Baixar credenciais JSON
5. ✅ Compartilhar planilha com Service Account
6. ✅ Copiar ID da planilha

**Você vai precisar de:**
- Email do Service Account (ex: `bot@projeto.iam.gserviceaccount.com`)
- Private Key (chave privada do JSON)
- ID da planilha (da URL)

---

## 🧪 Passo 3: Testar Localmente (Opcional)

### 3.1 Criar arquivo .env

Crie `.env` na raiz com suas credenciais:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=declaracao-irpf-bot@seu-projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
SPREADSHEET_ID=1A2B3C4D5E6F7G8H9I0J
```

### 3.2 Instalar Dependências

```bash
npm install
```

### 3.3 Rodar Localmente

```bash
# Instalar Vercel CLI (primeira vez)
npm install -g vercel

# Rodar em modo dev
vercel dev
```

**URL local:** http://localhost:3000

### 3.4 Testar

**Health Check:**
```bash
curl http://localhost:3000/api/declaracao
```

**Gerar Declaração:**
```bash
curl -X POST http://localhost:3000/api/declaracao \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João da Silva",
    "cpf": "123.456.789-00",
    "turma": "T1"
  }' \
  --output declaracao.docx
```

Se funcionar, você verá logs no terminal mostrando:
- Conexão com Google Sheets
- Linhas encontradas
- Filtros aplicados
- Documento gerado

---

## 🌐 Passo 4: Deploy no Vercel via GitHub

### 4.1 Inicializar Git

```bash
# Inicializar repositório
git init

# Adicionar arquivos
git add .

# Primeiro commit
git commit -m "Initial commit - API Declaração IRPF com Google Sheets"
```

### 4.2 Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. **Repository name**: `declaracao-irpf-api`
3. **Visibility**: Private (recomendado)
4. **NÃO** marque "Add README" (já temos)
5. Clique em **"Create repository"**

### 4.3 Push para GitHub

```bash
# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/declaracao-irpf-api.git

# Renomear branch para main
git branch -M main

# Push
git push -u origin main
```

### 4.4 Conectar ao Vercel

1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Selecione seu repositório `declaracao-irpf-api`
4. Clique em **"Import"**

### 4.5 Configurar Deploy

**Project Name:** `declaracao-irpf-api`

**Framework Preset:** Other (ou deixe em branco)

**Build Settings:**
- Build Command: (deixe vazio)
- Output Directory: (deixe vazio)
- Install Command: `npm install`

**NÃO FAÇA DEPLOY AINDA!** Primeiro configure as variáveis de ambiente.

---

## ⚙️ Passo 5: Configurar Variáveis de Ambiente no Vercel

### 5.1 Antes do Deploy

Na tela de configuração do projeto, procure por **"Environment Variables"**

### 5.2 Adicionar as 3 Variáveis

#### Variável 1: GOOGLE_SERVICE_ACCOUNT_EMAIL
```
Key: GOOGLE_SERVICE_ACCOUNT_EMAIL
Value: declaracao-irpf-bot@seu-projeto.iam.gserviceaccount.com
Environment: Production, Preview, Development
```

#### Variável 2: GOOGLE_PRIVATE_KEY
```
Key: GOOGLE_PRIVATE_KEY
Value: -----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
...
-----END PRIVATE KEY-----
Environment: Production, Preview, Development
```

⚠️ Cole a chave inteira, incluindo as linhas BEGIN e END

#### Variável 3: SPREADSHEET_ID
```
Key: SPREADSHEET_ID
Value: 1A2B3C4D5E6F7G8H9I0J
Environment: Production, Preview, Development
```

### 5.3 Fazer Deploy

Após adicionar as 3 variáveis, clique em **"Deploy"**

⏳ Aguarde ~2 minutos para o deploy completar

---

## ✅ Passo 6: Validar Deploy

### 6.1 Acessar URL

Após deploy, você receberá uma URL:
```
https://declaracao-irpf-api.vercel.app
```

### 6.2 Testar Health Check

```bash
curl https://declaracao-irpf-api.vercel.app/api/declaracao
```

**Resposta esperada:**
```json
{
  "status": "online",
  "service": "API Declaração IRPF - Google Sheets",
  "version": "2.0.0",
  "googleSheets": "configurado"
}
```

✅ Se aparecer `"googleSheets": "configurado"` → SUCESSO!

### 6.3 Testar Geração de Declaração

```bash
curl -X POST https://declaracao-irpf-api.vercel.app/api/declaracao \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "NOME_DO_ALUNO_NA_PLANILHA",
    "cpf": "CPF_DO_ALUNO_NA_PLANILHA",
    "turma": "T1"
  }' \
  --output teste_declaracao.docx
```

Se funcionar:
- ✅ Arquivo `teste_declaracao.docx` será baixado
- ✅ Abra e verifique os dados

### 6.4 Ver Logs

No dashboard do Vercel:
1. Vá para seu projeto
2. Clique em **"Functions"**
3. Clique em `api/declaracao.js`
4. Veja os logs em tempo real

---

## 🔗 Passo 7: Configurar Webhook no Blip

### 7.1 URL do Webhook

Use sua URL do Vercel:
```
https://declaracao-irpf-api.vercel.app/api/declaracao
```

### 7.2 Configurar no Blip

1. Portal Blip → Builder
2. Criar bloco **"HTTP Request"**
3. Configurar:

**Method:** POST

**URL:** 
```
https://declaracao-irpf-api.vercel.app/api/declaracao
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "nome": "{{contact.name}}",
  "cpf": "{{contact.extras.cpf}}",
  "email": "{{contact.extras.email}}",
  "turma": "{{contact.extras.turma}}"
}
```

**Response Variable:** `api_response`

**Timeout:** 30000 (30 segundos)

### 7.3 Processar Resposta

A API retorna o arquivo DOCX diretamente.

Configure o Blip para:
1. Receber o arquivo
2. Enviar para o usuário

---

## 🔄 Passo 8: Atualizações Futuras

### Como Atualizar o Código

```bash
# Fazer alterações no código
# ...

# Commit
git add .
git commit -m "Descrição da alteração"

# Push
git push origin main
```

✅ **Deploy automático!** Vercel detecta o push e faz deploy automaticamente.

### Como Atualizar a Planilha

**NÃO PRECISA FAZER NADA!**

1. Financeiro atualiza Google Sheets normalmente
2. API lê dados atualizados automaticamente
3. Zero downtime, zero deploy necessário

---

## 📊 Monitoramento

### Ver Logs em Tempo Real

1. Dashboard Vercel → Seu Projeto
2. **Functions** → `api/declaracao.js`
3. Logs aparecem aqui

### Métricas

1. Dashboard Vercel → Seu Projeto
2. **Analytics**
3. Veja: Requests, Errors, Duração

---

## ❓ Troubleshooting

### Erro: "googleSheets: não configurado"

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
1. Vercel Dashboard → Settings → Environment Variables
2. Verificar se as 3 variáveis estão lá
3. Fazer redeploy: Deployments → ⋮ → Redeploy

### Erro: "No access, refresh token..."

**Causa:** Planilha não compartilhada com Service Account

**Solução:**
1. Abrir Google Sheets
2. Compartilhar → Adicionar email do Service Account
3. Permissão: Leitor

### Erro: "Nenhum pagamento encontrado"

**Causa:** CPF/Nome não encontrado ou sem parcelas PAGAS de 2025

**Solução:**
1. Verificar se aluno está na planilha
2. Verificar coluna "Status" = "PAGO"
3. Verificar coluna "Ano" = 2025

### Deploy falha

**Solução:**
1. Ver logs do deploy no Vercel
2. Verificar se `package.json` está correto
3. Verificar se `api/declaracao.js` existe

---

## 🎯 Checklist Final

### Configuração:
- [ ] Google Cloud projeto criado
- [ ] Google Sheets API ativada
- [ ] Service Account criada
- [ ] Credenciais JSON baixadas
- [ ] Planilha compartilhada com Service Account
- [ ] ID da planilha copiado

### Código:
- [ ] Projeto criado localmente
- [ ] Arquivos na estrutura correta
- [ ] `.gitignore` criado
- [ ] Teste local funcionou

### Deploy:
- [ ] Repositório GitHub criado
- [ ] Código commitado e pushed
- [ ] Projeto importado no Vercel
- [ ] 3 variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Health check retorna "configurado"
- [ ] Teste de geração funcionou

### Integração:
- [ ] Webhook Blip configurado
- [ ] URL correta
- [ ] Teste end-to-end funcionou

---

## 📚 Documentação Relacionada

- **CONFIGURAR_GOOGLE_SHEETS.md** - Setup do Google Cloud
- **INTEGRACAO_BLIP.md** - Integração com Blip
- **README.md** - Documentação geral

---

## 🎉 Próximos Passos

Após deploy:

1. ✅ Testar com dados reais da planilha
2. ✅ Validar geração de declarações
3. ✅ Integrar com Blip
4. ✅ Treinar equipe
5. ✅ Colocar em produção

---

<div align="center">

## ✨ Deploy Completo!

**Sua API está rodando e lendo dados do Google Sheets em tempo real!**

**URL:** https://declaracao-irpf-api.vercel.app/api/declaracao

*Financeiro atualiza planilha → API usa dados atualizados automaticamente!*

</div>

---

**Data:** 05/02/2026  
**Versão:** 2.0 (Google Sheets Integration)  
**Status:** ✅ Pronto para Produção
