# 💻 Claude Code + Repositório Local - Guia Completo

## 🎯 O Que Você Vai Fazer

1. Baixar todos os arquivos do projeto
2. Criar repositório Git local
3. Organizar estrutura de pastas
4. Usar Claude Code para desenvolvimento
5. Testar localmente
6. Push para GitHub
7. Deploy no Vercel

**Tempo estimado:** 30 minutos

---

## 📦 Passo 1: Baixar Todos os Arquivos

### 1.1 Arquivos Principais (Solução Google Sheets)

Baixe estes arquivos que estão nos outputs acima:

**Código:**
- `api_declaracao_sheets.js`
- `package_sheets.json`
- `vercel_sheets.json`

**Documentação:**
- `INICIO_RAPIDO_GOOGLE_SHEETS.md`
- `CONFIGURAR_GOOGLE_SHEETS.md`
- `DEPLOY_VERCEL_GOOGLE_SHEETS.md`
- `README_GOOGLE_SHEETS.md`
- `INTEGRACAO_BLIP.md`

**Template:**
- `Recibo_IRPF_Produtos_-_2025_LM__1_.docx` (o que você enviou)

### 1.2 Salvar em Pasta Temporária

Crie uma pasta temporária e salve todos os arquivos:

```
C:\Downloads\declaracao-irpf\
├── api_declaracao_sheets.js
├── package_sheets.json
├── vercel_sheets.json
├── Recibo_IRPF_Produtos_-_2025_LM__1_.docx
├── INICIO_RAPIDO_GOOGLE_SHEETS.md
├── CONFIGURAR_GOOGLE_SHEETS.md
├── DEPLOY_VERCEL_GOOGLE_SHEETS.md
├── README_GOOGLE_SHEETS.md
└── INTEGRACAO_BLIP.md
```

---

## 🗂️ Passo 2: Criar Estrutura do Projeto

### 2.1 Criar Pasta do Projeto

Escolha onde quer trabalhar (ex: Documentos, Desktop, etc):

```bash
# Windows (PowerShell ou CMD)
cd C:\Users\SEU_USUARIO\Documents
mkdir declaracao-irpf-api
cd declaracao-irpf-api

# Mac/Linux
cd ~/Documents
mkdir declaracao-irpf-api
cd declaracao-irpf-api
```

### 2.2 Criar Subpastas

```bash
mkdir api
mkdir data
mkdir docs
```

### 2.3 Organizar Arquivos

Mova os arquivos baixados para a estrutura correta:

```
declaracao-irpf-api/
├── api/
│   └── declaracao.js              ← api_declaracao_sheets.js (RENOMEIE)
├── data/
│   └── Recibo_IRPF_2025.docx      ← Template (RENOMEIE)
├── docs/
│   ├── INICIO_RAPIDO_GOOGLE_SHEETS.md
│   ├── CONFIGURAR_GOOGLE_SHEETS.md
│   ├── DEPLOY_VERCEL_GOOGLE_SHEETS.md
│   └── INTEGRACAO_BLIP.md
├── package.json                    ← package_sheets.json (RENOMEIE)
├── vercel.json                     ← vercel_sheets.json (RENOMEIE)
└── README.md                       ← README_GOOGLE_SHEETS.md (RENOMEIE)
```

**IMPORTANTE:** Renomeie os arquivos conforme indicado!

---

## 📝 Passo 3: Criar Arquivos Adicionais

### 3.1 Criar .gitignore

Crie arquivo `.gitignore` na raiz do projeto:

```bash
# Windows
notepad .gitignore

# Mac/Linux
nano .gitignore
```

Cole este conteúdo:

```gitignore
# Dependências
node_modules/
package-lock.json

# Vercel
.vercel/

# Credenciais (NUNCA commitar!)
.env
.env.local
.env.production
*.json.bak

# Arquivos de serviço Google
*service-account*.json
credentials.json

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Sistema Operacional
.DS_Store
Thumbs.db
desktop.ini

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# Temporários
*.tmp
.cache/
dist/
build/

# Claude Code
.claude/
```

### 3.2 Criar .env.example

Crie arquivo `.env.example`:

```bash
# Google Sheets Configuration
# Obtenha estas credenciais seguindo o guia: docs/CONFIGURAR_GOOGLE_SHEETS.md

# Email do Service Account (do arquivo JSON baixado do Google Cloud)
GOOGLE_SERVICE_ACCOUNT_EMAIL=seu-service-account@projeto.iam.gserviceaccount.com

# Chave privada do Service Account (do arquivo JSON, incluindo BEGIN e END)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"

# ID da planilha do Google Sheets (da URL: docs.google.com/spreadsheets/d/ESTE_ID/edit)
SPREADSHEET_ID=1A2B3C4D5E6F7G8H9I0J

# ==============================================================================
# INSTRUÇÕES:
# ==============================================================================
# 1. Copie este arquivo para .env: cp .env.example .env
# 2. Preencha com suas credenciais reais
# 3. NUNCA commite o arquivo .env no Git
# 4. Para obter as credenciais, siga: docs/CONFIGURAR_GOOGLE_SHEETS.md
```

### 3.3 Atualizar README.md

Abra `README.md` e adicione no topo:

```markdown
# 🎯 API Declaração IRPF - Repositório Local

> Este é o repositório local do projeto. Para começar, siga o guia de início rápido.

## 🚀 Início Rápido

1. **Configure Google Sheets:** Veja `docs/CONFIGURAR_GOOGLE_SHEETS.md`
2. **Instale dependências:** `npm install`
3. **Configure variáveis:** Copie `.env.example` para `.env` e preencha
4. **Teste localmente:** `npm run dev`
5. **Deploy:** Siga `docs/DEPLOY_VERCEL_GOOGLE_SHEETS.md`

## 📂 Estrutura

```
├── api/              # Código da API
├── data/             # Template Word
├── docs/             # Documentação completa
├── package.json      # Dependências Node.js
├── vercel.json       # Config Vercel
└── README.md         # Este arquivo
```

---

[Resto do conteúdo original do README_GOOGLE_SHEETS.md]
```

---

## 🔧 Passo 4: Inicializar Git

### 4.1 Inicializar Repositório

```bash
git init
```

### 4.2 Configurar Git (se primeira vez)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@empresa.com"
```

### 4.3 Primeiro Commit

```bash
# Adicionar todos os arquivos
git add .

# Verificar o que vai ser commitado
git status

# Fazer commit
git commit -m "Initial commit: API Declaração IRPF com Google Sheets"
```

---

## 💻 Passo 5: Usar Claude Code

### 5.1 Instalar Claude Code (se ainda não tem)

**Windows/Mac/Linux:**

```bash
npm install -g @anthropic-ai/claude-code
```

Ou baixe em: https://claude.ai/code

### 5.2 Abrir Projeto no Claude Code

```bash
# Navegue até a pasta do projeto
cd C:\Users\SEU_USUARIO\Documents\declaracao-irpf-api

# Abra no Claude Code
claude-code .
```

### 5.3 Comandos Úteis no Claude Code

**No terminal integrado do Claude Code:**

```bash
# Instalar dependências
npm install

# Rodar localmente
npm run dev

# Ver status do Git
git status

# Ver diferenças
git diff

# Criar branch nova
git checkout -b feature/nova-funcionalidade
```

### 5.4 Pedir Ajuda ao Claude Code

No Claude Code, você pode perguntar coisas como:

```
"Explique como funciona a função buscarDadosFinanceiros em api/declaracao.js"

"Adicione logs mais detalhados na função gerarDeclaracao"

"Como posso testar se a conexão com Google Sheets está funcionando?"

"Crie um script de teste para validar a API"

"Adicione tratamento de erro melhor na linha 150"
```

---

## 🧪 Passo 6: Testar Localmente

### 6.1 Criar arquivo .env

```bash
# Copiar do exemplo
cp .env.example .env

# Editar com suas credenciais
# Windows: notepad .env
# Mac: nano .env
```

Cole suas credenciais reais (obtenha seguindo `docs/CONFIGURAR_GOOGLE_SHEETS.md`):

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=declaracao-irpf-bot@seu-projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0...\n-----END PRIVATE KEY-----\n"
SPREADSHEET_ID=1A2B3C4D5E6F7G8H9I0J
```

### 6.2 Instalar Dependências

```bash
npm install
```

### 6.3 Rodar Localmente

```bash
# Instalar Vercel CLI (primeira vez)
npm install -g vercel

# Rodar em modo dev
vercel dev
```

**Servidor vai rodar em:** http://localhost:3000

### 6.4 Testar API

**Teste 1: Health Check**

Abra navegador em: http://localhost:3000/api/declaracao

Ou via cURL:
```bash
curl http://localhost:3000/api/declaracao
```

**Resposta esperada:**
```json
{
  "status": "online",
  "service": "API Declaração IRPF - Google Sheets",
  "googleSheets": "configurado"
}
```

**Teste 2: Gerar Declaração**

```bash
curl -X POST http://localhost:3000/api/declaracao \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"NOME_NA_PLANILHA\",\"cpf\":\"CPF_NA_PLANILHA\",\"turma\":\"T1\"}" \
  --output teste.docx
```

Se funcionar, arquivo `teste.docx` será criado!

---

## 📤 Passo 7: Push para GitHub

### 7.1 Criar Repositório no GitHub

1. Vá para: https://github.com/new
2. **Repository name:** `declaracao-irpf-api`
3. **Visibility:** Private (recomendado)
4. **NÃO** marque "Initialize this repository with"
5. Clique em **"Create repository"**

### 7.2 Conectar Repositório Local ao GitHub

Copie os comandos que GitHub mostra, ou use:

```bash
# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/declaracao-irpf-api.git

# Renomear branch para main
git branch -M main

# Push
git push -u origin main
```

### 7.3 Verificar no GitHub

Abra: https://github.com/SEU_USUARIO/declaracao-irpf-api

Todos os arquivos devem estar lá (exceto `.env` que está no .gitignore)!

---

## 🚀 Passo 8: Deploy no Vercel

### 8.1 Via Dashboard Vercel

1. Acesse: https://vercel.com/new
2. **Import Git Repository**
3. Selecione seu repositório `declaracao-irpf-api`
4. **Configure as variáveis de ambiente** (as 3):
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `SPREADSHEET_ID`
5. Clique em **"Deploy"**

### 8.2 Via CLI Vercel

```bash
# Login
vercel login

# Deploy
vercel --prod
```

---

## 🔄 Passo 9: Workflow de Desenvolvimento

### Workflow Diário com Claude Code:

```bash
# 1. Abrir projeto
cd declaracao-irpf-api
claude-code .

# 2. Criar branch para nova feature
git checkout -b feature/melhoria-logs

# 3. Fazer alterações no código
# (Use Claude Code para ajudar!)

# 4. Testar localmente
vercel dev

# 5. Commit
git add .
git commit -m "Adiciona logs mais detalhados"

# 6. Push
git push origin feature/melhoria-logs

# 7. Criar Pull Request no GitHub

# 8. Merge para main → Deploy automático no Vercel!
```

### Exemplo de Perguntas para Claude Code:

```
"Como posso adicionar cache para reduzir chamadas ao Google Sheets?"

"Crie um endpoint /health que verifica se Google Sheets está acessível"

"Adicione validação de CPF antes de buscar dados"

"Como posso logar todas as requisições para auditoria?"

"Crie testes unitários para a função formatarMoeda"

"Otimize a função buscarDadosFinanceiros para ser mais rápida"
```

---

## 🎯 Comandos Úteis

### Git:

```bash
# Ver status
git status

# Ver histórico
git log --oneline

# Criar branch
git checkout -b nome-da-branch

# Voltar para main
git checkout main

# Atualizar do remoto
git pull origin main

# Ver diferenças
git diff
```

### NPM:

```bash
# Instalar dependências
npm install

# Adicionar nova dependência
npm install nome-do-pacote

# Atualizar dependências
npm update

# Ver dependências instaladas
npm list
```

### Vercel:

```bash
# Login
vercel login

# Deploy produção
vercel --prod

# Ver logs
vercel logs

# Ver projetos
vercel list
```

---

## 📂 Estrutura Final do Projeto

```
declaracao-irpf-api/
├── .git/                           # Git (oculto)
├── .vercel/                        # Vercel config (oculto, gitignored)
├── node_modules/                   # Dependências (gitignored)
├── api/
│   └── declaracao.js               # API principal
├── data/
│   └── Recibo_IRPF_2025.docx      # Template
├── docs/
│   ├── INICIO_RAPIDO_GOOGLE_SHEETS.md
│   ├── CONFIGURAR_GOOGLE_SHEETS.md
│   ├── DEPLOY_VERCEL_GOOGLE_SHEETS.md
│   └── INTEGRACAO_BLIP.md
├── .env                            # Suas credenciais (gitignored)
├── .env.example                    # Template de credenciais
├── .gitignore                      # Arquivos ignorados
├── package.json                    # Dependências
├── package-lock.json               # Lock de dependências
├── vercel.json                     # Config Vercel
└── README.md                       # Documentação
```

---

## ✅ Checklist Completo

### Estrutura:
- [ ] Pasta do projeto criada
- [ ] Subpastas (api, data, docs) criadas
- [ ] Arquivos copiados e renomeados corretamente
- [ ] .gitignore criado
- [ ] .env.example criado
- [ ] README.md atualizado

### Git:
- [ ] Git inicializado (`git init`)
- [ ] Git configurado (user.name e user.email)
- [ ] Primeiro commit feito
- [ ] Repositório GitHub criado
- [ ] Remote adicionado
- [ ] Push para GitHub realizado

### Desenvolvimento:
- [ ] Claude Code instalado
- [ ] Projeto aberto no Claude Code
- [ ] Dependências instaladas (`npm install`)
- [ ] .env criado com credenciais reais
- [ ] Teste local funcionou (`vercel dev`)
- [ ] Health check OK
- [ ] Geração de teste OK

### Deploy:
- [ ] Repositório conectado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] API funcionando em produção
- [ ] Webhook Blip configurado (opcional)

---

## 🎓 Dicas Pro

### 1. Use Branches

```bash
# Para cada nova feature
git checkout -b feature/nome-da-feature

# Trabalhe na feature
# ...

# Push da branch
git push origin feature/nome-da-feature

# No GitHub, crie Pull Request
# Merge para main → Deploy automático!
```

### 2. Commits Frequentes

```bash
# Commits pequenos e descritivos
git add .
git commit -m "Adiciona validação de CPF"
git push

# Melhor que commits gigantes
```

### 3. Use Claude Code para Tudo

- Explicar código
- Refatorar
- Adicionar features
- Debugar
- Criar testes
- Melhorar performance
- Adicionar logs

### 4. Mantenha .env Seguro

```bash
# NUNCA faça isso:
git add .env

# Se acidentalmente adicionar:
git reset .env
```

---

## ❓ Troubleshooting

### "git command not found"
**Solução:** Instale Git: https://git-scm.com/downloads

### "npm command not found"
**Solução:** Instale Node.js: https://nodejs.org/

### "vercel command not found"
**Solução:** `npm install -g vercel`

### Erro ao instalar dependências
**Solução:** 
```bash
rm -rf node_modules package-lock.json
npm install
```

### .env não está sendo lido
**Solução:** Certifique-se que está na raiz do projeto

---

## 📚 Próximos Passos

1. ✅ Seguir este guia para setup
2. ✅ Testar localmente
3. ✅ Push para GitHub
4. ✅ Deploy no Vercel
5. ✅ Configurar webhook Blip
6. ✅ Usar Claude Code para melhorias

---

<div align="center">

## 🎉 Repositório Local Pronto!

**Agora você tem:**

✅ Repositório Git local  
✅ Estrutura organizada  
✅ Claude Code configurado  
✅ Testes funcionando  
✅ Conectado ao GitHub  
✅ Deploy automático no Vercel  

**Comece a desenvolver com Claude Code!**

</div>

---

**Versão:** 1.0  
**Data:** 05/02/2026  
**Tempo Total:** ~30 minutos
