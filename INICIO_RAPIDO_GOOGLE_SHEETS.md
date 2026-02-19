# ⚡ INÍCIO RÁPIDO - Google Sheets + Vercel

## 🎯 Solução Definitiva para Você

Sua planilha está no **Google Sheets** → Esta é a **MELHOR solução!**

**Vantagens:**
- ✅ Financeiro continua usando Google Sheets normalmente
- ✅ Dados **sempre atualizados** (tempo real)
- ✅ **Zero trabalho** de exportar/importar
- ✅ Deploy automático na Vercel
- ✅ 100% gratuito

---

## 📦 Arquivos da Solução Google Sheets

### Código:
1. **api_declaracao_sheets.js** → Renomear para `api/declaracao.js`
2. **package_sheets.json** → Renomear para `package.json`
3. **vercel_sheets.json** → Renomear para `vercel.json`

### Documentação:
4. **README_GOOGLE_SHEETS.md** - Visão geral
5. **CONFIGURAR_GOOGLE_SHEETS.md** - Setup Google Cloud (COMECE AQUI!)
6. **DEPLOY_VERCEL_GOOGLE_SHEETS.md** - Deploy completo

### Template:
7. **data/Recibo_IRPF_2025.docx** - Seu template Word

---

## 🚀 Roteiro Completo (60 minutos)

### ⏰ Etapa 1: Configurar Google Sheets API (15 min)

📖 **Siga:** `CONFIGURAR_GOOGLE_SHEETS.md`

**O que você vai fazer:**
1. Criar projeto no Google Cloud Console
2. Ativar Google Sheets API
3. Criar Service Account
4. Baixar credenciais (arquivo JSON)
5. Compartilhar sua planilha com Service Account

**Você vai precisar:**
- Conta Google
- Link da planilha de inadimplência

**Resultado:**
- ✅ Email do Service Account (guarde!)
- ✅ Private Key (guarde!)
- ✅ ID da planilha (guarde!)

---

### ⏰ Etapa 2: Preparar Projeto (10 min)

```bash
# 1. Criar pasta
mkdir declaracao-irpf-api
cd declaracao-irpf-api

# 2. Criar estrutura
mkdir api
mkdir data

# 3. Copiar arquivos
# api_declaracao_sheets.js → api/declaracao.js
# package_sheets.json → package.json
# vercel_sheets.json → vercel.json
# Recibo_IRPF_2025.docx → data/Recibo_IRPF_2025.docx

# 4. Criar .gitignore
cat > .gitignore << EOF
node_modules/
.vercel/
.env
.env.local
*.json
!package.json
!vercel.json
*.log
EOF

# 5. Instalar dependências
npm install
```

---

### ⏰ Etapa 3: Testar Localmente (10 min) - OPCIONAL

```bash
# 1. Criar .env com suas credenciais
cat > .env << EOF
GOOGLE_SERVICE_ACCOUNT_EMAIL=seu-service-account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"
SPREADSHEET_ID=seu_spreadsheet_id_aqui
EOF

# 2. Instalar Vercel CLI
npm install -g vercel

# 3. Rodar localmente
vercel dev

# 4. Testar em outra janela do terminal
curl http://localhost:3000/api/declaracao
```

**Resposta esperada:**
```json
{
  "status": "online",
  "googleSheets": "configurado"
}
```

---

### ⏰ Etapa 4: Deploy no Vercel (15 min)

📖 **Siga:** `DEPLOY_VERCEL_GOOGLE_SHEETS.md`

**Resumo:**

```bash
# 1. Inicializar Git
git init
git add .
git commit -m "Initial commit"

# 2. Criar repo no GitHub
# Vá em: https://github.com/new
# Nome: declaracao-irpf-api

# 3. Push
git remote add origin https://github.com/SEU_USUARIO/declaracao-irpf-api.git
git branch -M main
git push -u origin main

# 4. Deploy no Vercel
# Vá em: https://vercel.com/new
# Import Git Repository
# Selecione seu repo
```

**IMPORTANTE:** Antes de clicar em "Deploy", configure as variáveis:

1. **GOOGLE_SERVICE_ACCOUNT_EMAIL**: `seu-bot@projeto.iam.gserviceaccount.com`
2. **GOOGLE_PRIVATE_KEY**: Cole a chave privada INTEIRA do JSON
3. **SPREADSHEET_ID**: `1A2B3C4D5E6F7G8H9I0J`

Clique em **"Deploy"** e aguarde ~2 minutos.

---

### ⏰ Etapa 5: Testar em Produção (5 min)

```bash
# URL da sua API (Vercel fornece)
API_URL=https://seu-projeto.vercel.app

# 1. Health check
curl $API_URL/api/declaracao

# 2. Gerar declaração de teste
curl -X POST $API_URL/api/declaracao \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "NOME_NA_PLANILHA",
    "cpf": "CPF_NA_PLANILHA",
    "turma": "T1"
  }' \
  --output teste.docx

# 3. Abrir arquivo
# Verifique se os dados estão corretos
```

---

### ⏰ Etapa 6: Integrar com Blip (5 min)

No Portal Blip:

1. Criar bloco **"HTTP Request"**
2. **Method**: POST
3. **URL**: `https://seu-projeto.vercel.app/api/declaracao`
4. **Headers**: `{"Content-Type": "application/json"}`
5. **Body**:
```json
{
  "nome": "{{contact.name}}",
  "cpf": "{{contact.extras.cpf}}",
  "email": "{{contact.extras.email}}",
  "turma": "{{contact.extras.turma}}"
}
```
6. **Response Variable**: `api_response`
7. **Timeout**: 30000

---

## ✅ Checklist Rápido

### Configuração Google Cloud:
- [ ] Projeto criado
- [ ] Google Sheets API ativada
- [ ] Service Account criada
- [ ] Arquivo JSON baixado
- [ ] Planilha compartilhada com Service Account
- [ ] 3 valores guardados (email, key, spreadsheet_id)

### Projeto Local:
- [ ] Pasta criada
- [ ] Arquivos copiados e renomeados
- [ ] `.gitignore` criado
- [ ] `npm install` executado
- [ ] Teste local funcionou (opcional)

### Deploy:
- [ ] Git inicializado
- [ ] Repo GitHub criado
- [ ] Código pushed
- [ ] Projeto importado no Vercel
- [ ] 3 variáveis configuradas
- [ ] Deploy realizado
- [ ] Health check OK
- [ ] Teste de geração OK

### Integração:
- [ ] Webhook Blip configurado
- [ ] Teste end-to-end funcionou

---

## 🎯 Próximos Passos

### Hoje:
1. ✅ Seguir este guia
2. ✅ Configurar Google Cloud
3. ✅ Fazer deploy

### Amanhã:
4. ✅ Testar com dados reais
5. ✅ Integrar com Blip
6. ✅ Validar com equipe

### Próxima Semana:
7. ✅ Treinar equipe de suporte
8. ✅ Colocar em produção
9. ✅ Monitorar resultados

---

## 💡 Dicas Importantes

### ✅ Faça:
- Guarde as 3 credenciais em local seguro
- Use .gitignore para não commitar credenciais
- Teste com dados reais antes de produção
- Configure domínio custom no Vercel (opcional)

### ❌ Evite:
- Commitar arquivo .env no Git
- Dar mais permissões que necessário na planilha
- Compartilhar credenciais publicamente

---

## ❓ Dúvidas Comuns

**Q: Preciso atualizar a API quando a planilha mudar?**
A: NÃO! API lê em tempo real. Financeiro atualiza Sheets → API usa dados novos automaticamente.

**Q: E se a planilha estiver muito grande?**
A: Google Sheets API aguenta milhões de linhas. Sem problemas.

**Q: Posso usar planilha de outra conta Google?**
A: Sim! Basta compartilhar com o Service Account (email).

**Q: Quanto custa?**
A: ZERO! Vercel free tier + Google Sheets API gratuita = R$ 0

**Q: E se eu errar algo?**
A: Logs detalhados no Vercel. Fácil de debugar.

---

## 📞 Suporte

**Problemas em:**

- **Google Cloud** → CONFIGURAR_GOOGLE_SHEETS.md (seção Troubleshooting)
- **Deploy** → DEPLOY_VERCEL_GOOGLE_SHEETS.md (seção Troubleshooting)
- **Código** → README_GOOGLE_SHEETS.md
- **Blip** → INTEGRACAO_BLIP.md

---

## 🎉 Você Vai Conseguir!

Este guia foi feito para ser **simples e direto**. Siga passo a passo e em 1 hora você terá tudo funcionando!

---

<div align="center">

## ✨ Sistema Perfeito para Você!

**Google Sheets (que já usa) + Node.js + Vercel**

*Dados em tempo real • Zero manutenção • 100% automático*

**Comece agora com:** `CONFIGURAR_GOOGLE_SHEETS.md`

</div>

---

**Versão:** 2.0  
**Data:** 05/02/2026  
**Tempo Total:** ~60 minutos  
**Dificuldade:** ⭐⭐ (Fácil)
