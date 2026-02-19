# 🔐 Configurar Google Sheets API - Guia Completo

## 📋 O Que Você Vai Fazer

1. Criar projeto no Google Cloud Console
2. Ativar Google Sheets API
3. Criar Service Account (conta de serviço)
4. Gerar credenciais (chave JSON)
5. Compartilhar planilha com Service Account
6. Configurar variáveis no Vercel

**Tempo estimado:** 10-15 minutos

---

## 🚀 Passo 1: Criar Projeto no Google Cloud

### 1.1 Acessar Google Cloud Console

Acesse: https://console.cloud.google.com

### 1.2 Criar Novo Projeto

1. Clique no **seletor de projetos** (topo da página)
2. Clique em **"Novo Projeto"**
3. Preencha:
   - **Nome do projeto**: `Declaracao-IRPF-API`
   - **Organização**: (deixe como está)
4. Clique em **"Criar"**
5. Aguarde a criação (~30 segundos)
6. Selecione o projeto criado

---

## 📊 Passo 2: Ativar Google Sheets API

### 2.1 Acessar Biblioteca de APIs

1. No menu lateral esquerdo, clique em **"APIs e Serviços"** → **"Biblioteca"**
2. Ou acesse direto: https://console.cloud.google.com/apis/library

### 2.2 Ativar a API

1. Na busca, digite: **"Google Sheets API"**
2. Clique no resultado **"Google Sheets API"**
3. Clique no botão **"Ativar"**
4. Aguarde ativação (~10 segundos)

✅ **Pronto!** A API está ativada

---

## 🔑 Passo 3: Criar Service Account (Conta de Serviço)

### 3.1 Acessar Credenciais

1. No menu lateral, clique em **"APIs e Serviços"** → **"Credenciais"**
2. Ou acesse: https://console.cloud.google.com/apis/credentials

### 3.2 Criar Service Account

1. Clique em **"Criar credenciais"** (topo)
2. Selecione **"Conta de serviço"**

3. **Etapa 1 - Detalhes da conta de serviço:**
   - **Nome da conta de serviço**: `declaracao-irpf-bot`
   - **ID da conta de serviço**: (será preenchido automaticamente)
   - **Descrição**: `Bot para gerar declarações de IRPF`
   - Clique em **"Criar e continuar"**

4. **Etapa 2 - Conceder acesso ao projeto:**
   - **Selecionar papel**: Deixe vazio (não é necessário)
   - Clique em **"Continuar"**

5. **Etapa 3 - Conceder acesso aos usuários:**
   - Deixe vazio
   - Clique em **"Concluído"**

✅ **Service Account criada!**

---

## 📄 Passo 4: Gerar Chave JSON

### 4.1 Acessar Service Account

1. Na página de **Credenciais**, você verá a lista de **"Contas de serviço"**
2. Clique no email da conta que você criou:
   - Algo como: `declaracao-irpf-bot@seu-projeto.iam.gserviceaccount.com`

### 4.2 Gerar Chave

1. Vá na aba **"Chaves"**
2. Clique em **"Adicionar chave"** → **"Criar nova chave"**
3. Selecione tipo: **JSON**
4. Clique em **"Criar"**

📥 **Um arquivo JSON será baixado automaticamente!**

**Nome do arquivo:** `seu-projeto-xxxxx.json`

### 4.3 Exemplo do Arquivo JSON

O arquivo terá essa estrutura:

```json
{
  "type": "service_account",
  "project_id": "declaracao-irpf-api",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n",
  "client_email": "declaracao-irpf-bot@seu-projeto.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

⚠️ **IMPORTANTE:** 
- **Guarde este arquivo em local seguro**
- **NUNCA** compartilhe publicamente
- **NUNCA** commite no Git

---

## 📊 Passo 5: Compartilhar Planilha com Service Account

### 5.1 Copiar Email do Service Account

Do arquivo JSON baixado, copie o valor de `"client_email"`:

```
declaracao-irpf-bot@seu-projeto.iam.gserviceaccount.com
```

### 5.2 Abrir Sua Planilha do Google Sheets

1. Abra a planilha de inadimplência no Google Sheets
2. Clique no botão **"Compartilhar"** (canto superior direito)

### 5.3 Compartilhar com Service Account

1. No campo "Adicionar pessoas e grupos", cole o email do Service Account:
   ```
   declaracao-irpf-bot@seu-projeto.iam.gserviceaccount.com
   ```

2. **Permissão**: Selecione **"Leitor"** (a API só precisa ler)

3. **DESMARQUE** a opção "Notificar pessoas" (não precisa enviar email)

4. Clique em **"Compartilhar"**

✅ **Pronto!** A API agora pode ler sua planilha

### 5.4 Copiar ID da Planilha

Na URL da planilha, copie o ID:

```
https://docs.google.com/spreadsheets/d/1A2B3C4D5E6F7G8H9I0J/edit
                                          ↑
                                   Este é o ID
```

Exemplo: `1A2B3C4D5E6F7G8H9I0J`

**Guarde esse ID!** Você vai usar nas variáveis de ambiente.

---

## ⚙️ Passo 6: Configurar Variáveis no Vercel

### 6.1 Acessar Projeto no Vercel

1. Vá para: https://vercel.com/dashboard
2. Clique no seu projeto `declaracao-irpf-api`
3. Vá em **Settings** → **Environment Variables**

### 6.2 Adicionar Variáveis

Adicione estas 3 variáveis:

#### Variável 1: GOOGLE_SERVICE_ACCOUNT_EMAIL

- **Key**: `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- **Value**: 
  ```
  declaracao-irpf-bot@seu-projeto.iam.gserviceaccount.com
  ```
  (copie do campo `client_email` do JSON)
- **Environment**: Production, Preview, Development

#### Variável 2: GOOGLE_PRIVATE_KEY

- **Key**: `GOOGLE_PRIVATE_KEY`
- **Value**: 
  ```
  -----BEGIN PRIVATE KEY-----
  MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
  ...
  -----END PRIVATE KEY-----
  ```
  (copie TODO o valor de `private_key` do JSON, **incluindo** as linhas BEGIN e END)
  
⚠️ **IMPORTANTE:** Cole a chave exatamente como está no JSON, com as quebras de linha (`\n`)

- **Environment**: Production, Preview, Development

#### Variável 3: SPREADSHEET_ID

- **Key**: `SPREADSHEET_ID`
- **Value**: 
  ```
  1A2B3C4D5E6F7G8H9I0J
  ```
  (o ID que você copiou da URL da planilha)
- **Environment**: Production, Preview, Development

### 6.3 Salvar

Clique em **"Save"** para cada variável.

---

## ✅ Checklist de Configuração

Marque conforme for completando:

- [ ] Projeto criado no Google Cloud Console
- [ ] Google Sheets API ativada
- [ ] Service Account criada
- [ ] Arquivo JSON baixado e guardado em segurança
- [ ] Planilha compartilhada com Service Account (email)
- [ ] ID da planilha copiado
- [ ] Variável `GOOGLE_SERVICE_ACCOUNT_EMAIL` configurada no Vercel
- [ ] Variável `GOOGLE_PRIVATE_KEY` configurada no Vercel
- [ ] Variável `SPREADSHEET_ID` configurada no Vercel

---

## 🧪 Testar Configuração

### Teste Local (Opcional)

Crie arquivo `.env` na raiz do projeto:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=declaracao-irpf-bot@seu-projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n"
SPREADSHEET_ID=1A2B3C4D5E6F7G8H9I0J
```

Execute:
```bash
npm install
vercel dev
```

### Teste em Produção

Após fazer deploy:

```bash
curl https://seu-projeto.vercel.app/api/declaracao
```

**Resposta esperada:**
```json
{
  "status": "online",
  "service": "API Declaração IRPF - Google Sheets",
  "googleSheets": "configurado"
}
```

---

## ❓ Troubleshooting

### Erro: "No access, refresh token, API key or refresh handler callback"

**Causa:** Planilha não compartilhada com Service Account

**Solução:** 
1. Abra a planilha
2. Compartilhe com o email do Service Account
3. Permissão: Leitor

### Erro: "Error: The caller does not have permission"

**Causa:** API não ativada ou Service Account sem permissão

**Solução:**
1. Confirme que Google Sheets API está ativada
2. Verifique se planilha está compartilhada

### Erro: "Invalid grant: account not found"

**Causa:** Email do Service Account incorreto

**Solução:**
1. Verifique o valor de `GOOGLE_SERVICE_ACCOUNT_EMAIL`
2. Deve ser exatamente igual ao `client_email` do JSON

### Erro: "Error: Invalid PEM formatted message"

**Causa:** Chave privada incorreta ou mal formatada

**Solução:**
1. Verifique `GOOGLE_PRIVATE_KEY` no Vercel
2. Deve incluir `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`
3. Deve ter as quebras de linha (`\n`)

---

## 🔒 Segurança

### Boas Práticas:

✅ **FAÇA:**
- Guarde o arquivo JSON em local seguro
- Use apenas permissão "Leitor" na planilha
- Mantenha credenciais apenas no Vercel
- Crie `.gitignore` para não commitar credenciais

❌ **NÃO FAÇA:**
- Nunca commite arquivo JSON no Git
- Nunca compartilhe credenciais publicamente
- Nunca dê mais permissões que o necessário
- Nunca coloque credenciais em código

### Arquivo .gitignore

```
# Credenciais
*.json
.env
.env.local

# Node
node_modules/

# Vercel
.vercel/
```

---

## 📚 Referências

- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🎉 Próximos Passos

Após configurar:

1. ✅ Faça deploy no Vercel
2. ✅ Teste a API
3. ✅ Configure webhook no Blip
4. ✅ Teste fluxo completo

---

<div align="center">

## ✨ Configuração Completa!

**Sua API agora lê dados direto do Google Sheets em tempo real!**

*Financeiro atualiza a planilha → API usa dados atualizados automaticamente*

</div>
