# 🎯 API Declaração IRPF - Google Sheets + Vercel

## ✨ Solução Definitiva

Sistema que **lê dados direto do Google Sheets em tempo real** para gerar declarações de IRPF automaticamente.

### 🚀 Principais Vantagens

- ✅ **Dados sempre atualizados** - Lê direto do Google Sheets
- ✅ **Zero manutenção** - Financeiro continua usando Sheets normalmente
- ✅ **Deploy automático** - Git push = deploy na Vercel
- ✅ **Escalável** - Serverless, aguenta qualquer volume
- ✅ **Gratuito** - Vercel free tier é mais que suficiente

---

## 📋 Como Funciona

```
1. Aluno solicita no Blip
        ↓
2. Blip chama webhook da API (Vercel)
        ↓
3. API lê Google Sheets (tempo real)
        ↓
4. Filtra: Ano 2025 + Status PAGO
        ↓
5. Gera documento Word (DOCX)
        ↓
6. Retorna arquivo para Blip
        ↓
7. Blip envia ao aluno
```

---

## 📦 O Que Está Incluído

### Código:
- **api/declaracao.js** - API completa com Google Sheets API
- **package.json** - Dependências (google-spreadsheet, docxtemplater)
- **vercel.json** - Configuração Vercel

### Documentação:
- **CONFIGURAR_GOOGLE_SHEETS.md** - Setup Google Cloud (passo a passo)
- **DEPLOY_VERCEL_GOOGLE_SHEETS.md** - Deploy completo
- **README.md** - Este arquivo

### Template:
- **data/Recibo_IRPF_2025.docx** - Template Word

---

## 🚀 Início Rápido

### 1. Configure Google Sheets (15 minutos)

Siga: **CONFIGURAR_GOOGLE_SHEETS.md**

**Você vai precisar:**
- Projeto no Google Cloud Console
- Google Sheets API ativada
- Service Account criada
- Credenciais (JSON)
- Planilha compartilhada com Service Account

### 2. Prepare o Projeto

```bash
# Criar estrutura
mkdir declaracao-irpf-api
cd declaracao-irpf-api

# Copiar arquivos
# api_declaracao_sheets.js → api/declaracao.js
# package_sheets.json → package.json
# vercel_sheets.json → vercel.json
# Template → data/Recibo_IRPF_2025.docx

# Instalar dependências
npm install
```

### 3. Deploy no Vercel

Siga: **DEPLOY_VERCEL_GOOGLE_SHEETS.md**

```bash
# Push para GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# Conectar no Vercel
# 1. Importar repositório GitHub
# 2. Configurar 3 variáveis de ambiente:
#    - GOOGLE_SERVICE_ACCOUNT_EMAIL
#    - GOOGLE_PRIVATE_KEY
#    - SPREADSHEET_ID
# 3. Deploy!
```

### 4. Testar

```bash
# Health check
curl https://seu-projeto.vercel.app/api/declaracao

# Gerar declaração
curl -X POST https://seu-projeto.vercel.app/api/declaracao \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João da Silva",
    "cpf": "123.456.789-00",
    "turma": "T1"
  }' \
  --output declaracao.docx
```

---

## 📊 Estrutura da Planilha

Sua planilha no Google Sheets deve ter estas colunas:

| Nome | CPF | Email | Turma | Parcela | Mes | Ano | Valor | Status |
|------|-----|-------|-------|---------|-----|-----|-------|--------|
| João da Silva | 123.456.789-00 | joao@email.com | T1 | 1 | 1 | 2025 | 1500.00 | PAGO |
| João da Silva | 123.456.789-00 | joao@email.com | T1 | 2 | 2 | 2025 | 1500.00 | PAGO |
| Maria Costa | 987.654.321-00 | maria@email.com | T2 | 1 | 1 | 2025 | 1200.00 | PAGO |

**Campos obrigatórios:**
- `Nome` - Nome completo do aluno
- `CPF` - CPF (com ou sem formatação)
- `Email` - Email do aluno
- `Turma` - Código da turma (T1, T2, SEI3, etc)
- `Parcela` - Número da parcela (1, 2, 3...)
- `Mes` - Mês da parcela (1-12)
- `Ano` - Ano (2025)
- `Valor` - Valor em número (1500.00)
- `Status` - Status (PAGO, PENDENTE, etc)

---

## ⚙️ Variáveis de Ambiente

Configure no Vercel (Settings → Environment Variables):

### GOOGLE_SERVICE_ACCOUNT_EMAIL
```
declaracao-irpf-bot@seu-projeto.iam.gserviceaccount.com
```

### GOOGLE_PRIVATE_KEY
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
-----END PRIVATE KEY-----
```

### SPREADSHEET_ID
```
1A2B3C4D5E6F7G8H9I0J
```

---

## 🔗 Integração com Blip

### Webhook URL:
```
https://seu-projeto.vercel.app/api/declaracao
```

### Request (POST):
```json
{
  "nome": "{{contact.name}}",
  "cpf": "{{contact.extras.cpf}}",
  "email": "{{contact.extras.email}}",
  "turma": "{{contact.extras.turma}}"
}
```

### Response (Success):
```
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename="Declaracao_IRPF_Joao_Silva.docx"

[Binary DOCX file]
```

### Response (Tutorial - Turma SEI):
```json
{
  "success": true,
  "tipo": "tutorial",
  "mensagem": "Turma SEI - enviar tutorial escrito"
}
```

### Response (Error):
```json
{
  "success": false,
  "erro": "Nenhum pagamento encontrado para 2025"
}
```

---

## 🔄 Como Atualizar Dados

### Atualizar Planilha:
1. Financeiro edita Google Sheets normalmente
2. **API lê automaticamente os novos dados**
3. Zero downtime, zero deploy necessário

### Atualizar Código:
```bash
git add .
git commit -m "Atualização"
git push origin main
```
✅ Deploy automático no Vercel!

---

## 📈 Limites e Performance

### Vercel Free Tier:
- ✅ 100 GB de banda/mês
- ✅ 100 deployments/dia
- ✅ Função serverless: 10s timeout
- ✅ Mais que suficiente para centenas de solicitações/dia

### Google Sheets API:
- ✅ 300 leituras por minuto (gratuito)
- ✅ Mais que suficiente para o volume esperado

---

## ❓ Troubleshooting

### "googleSheets: não configurado"
→ Variáveis de ambiente não configuradas no Vercel

### "No access, refresh token..."
→ Planilha não compartilhada com Service Account

### "Nenhum pagamento encontrado"
→ Verificar se aluno tem parcelas de 2025 com status PAGO

### Deploy falha
→ Ver logs no Vercel Dashboard

---

## 🔒 Segurança

✅ **FAÇA:**
- Guarde arquivo JSON em local seguro
- Use .gitignore para não commitar credenciais
- Mantenha credenciais apenas no Vercel
- Use permissão "Leitor" na planilha

❌ **NÃO FAÇA:**
- Nunca commite credenciais no Git
- Nunca compartilhe chave privada
- Nunca dê mais permissões que necessário

---

## 📚 Documentação Completa

1. **CONFIGURAR_GOOGLE_SHEETS.md** - Setup Google Cloud (passo a passo com screenshots)
2. **DEPLOY_VERCEL_GOOGLE_SHEETS.md** - Deploy completo (GitHub + Vercel)
3. **INTEGRACAO_BLIP.md** - Integração com Blip (fluxos e webhooks)

---

## ✅ Checklist de Implementação

- [ ] Google Cloud projeto criado
- [ ] Google Sheets API ativada
- [ ] Service Account criada
- [ ] Credenciais JSON baixadas
- [ ] Planilha compartilhada com Service Account
- [ ] Projeto criado localmente
- [ ] Código no GitHub
- [ ] Variáveis configuradas no Vercel
- [ ] Deploy realizado
- [ ] Testes funcionando
- [ ] Webhook Blip configurado

---

## 🎉 Pronto para Uso

Após seguir os guias, você terá:

✅ API rodando no Vercel  
✅ Lendo dados do Google Sheets em tempo real  
✅ Gerando declarações automaticamente  
✅ Integrada com Blip  
✅ Deploy automático via Git  

**Zero manutenção necessária!**

---

## 📞 Suporte

**Dúvidas sobre:**
- Google Sheets → CONFIGURAR_GOOGLE_SHEETS.md
- Deploy → DEPLOY_VERCEL_GOOGLE_SHEETS.md
- Blip → INTEGRACAO_BLIP.md

---

<div align="center">

## ✨ Solução Perfeita!

**Google Sheets + Node.js + Vercel**

*Dados em tempo real • Zero manutenção • Deploy automático*

</div>

---

**Versão:** 2.0 (Google Sheets Integration)  
**Data:** 05/02/2026  
**Status:** ✅ Pronto para Produção
