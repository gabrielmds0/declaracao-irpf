# API de Declaração IRPF — Liberdade Médica

API serverless que gera automaticamente a **Declaração de Pagamentos para o IRPF** de alunos da pós-graduação Liberdade Médica, enviando o PDF por e-mail sem intervenção humana.

---

## O que faz

O aluno informa seu **nome** e **CPF** (via chatbot Blip ou formulário). A API:

1. Consulta a planilha Google Sheets em tempo real
2. Filtra as parcelas com status **PAGO** no ano-calendário 2025
3. Gera um PDF oficial A4 com assinatura da empresa
4. Envia o documento ao e-mail do aluno automaticamente
5. Registra o log da operação em banco PostgreSQL

---

## Stack

| Camada | Tecnologia |
|---|---|
| Hospedagem | Vercel (serverless) |
| Runtime | Node.js ≥ 18 |
| Fonte de dados | Google Sheets API v4 |
| Geração de PDF | Puppeteer Core + @sparticuz/chromium |
| E-mail | Nodemailer + Gmail OAuth2 |
| Auditoria | PostgreSQL |

---

## Estrutura

```
declaracao-irpf-api/
├── api/
│   └── api_declaracao_sheets.js   # Função principal (endpoint Vercel)
├── data/
│   ├── liberdade_medica_logo.webp # Logo embarcada no PDF (base64)
│   ├── signature.png              # Assinatura digital
│   ├── watermark.png              # Marca d'água
│   └── relatorio_api.pdf          # Relatório técnico do projeto
├── server.js                      # Servidor local para testes (porta 3000)
├── vercel.json                    # Roteamento e config da função
├── .env.example                   # Variáveis de ambiente necessárias
└── package.json
```

---

## Endpoints

### `POST /api/declaracao`
Gera a declaração a partir de um JSON body.

```bash
curl -X POST https://declaracao-irpf-api.vercel.app/api/declaracao \
  -H "Content-Type: application/json" \
  -d '{"nome": "NOME COMPLETO", "cpf": "00000000000"}' \
  --output declaracao.pdf
```

Adicione `?format=base64` para receber JSON com o PDF em base64 (ideal para integrações Blip).

### `GET /api/declaracao?nome=&cpf=`
Mesmo comportamento via query string — retorna PDF binário diretamente.

```
GET /api/declaracao?nome=NOME+COMPLETO&cpf=00000000000
```

### `GET /api/declaracao`
Health check — retorna JSON com status da API.

---

## Lógica de negócio

| Situação | Resposta |
|---|---|
| Aluno Turma 1 ou 2 com parcelas pagas em 2025 | Gera PDF + envia e-mail |
| Aluno de Turma SEI (3, 4, 5…) | Retorna `tipo: "tutorial"` para o Blip |
| Aluno não encontrado na planilha | Retorna `tipo: "tutorial"` |
| Aluno T1/T2 sem pagamentos em 2025 | Erro 400 com mensagem explicativa |

---

## Configuração local

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar arquivo `.env`

```bash
cp .env.example .env
```

Preencha com as credenciais reais:

```env
# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SPREADSHEET_ID=id_da_planilha

# Gmail OAuth2
GMAIL_USER=suporte@liberdademedicaedu.com.br
GMAIL_CLIENT_ID=...
GMAIL_CLIENT_SECRET=...
GMAIL_REFRESH_TOKEN=...

# Opcional — redireciona todos os e-mails para este endereço durante testes
TEST_EMAIL=seu@email.com
```

### 3. Rodar localmente

```bash
npm run dev
```

### 4. Testar

```bash
curl -X POST http://localhost:3000/api/declaracao \
  -H "Content-Type: application/json" \
  -d '{"nome":"NOME DO ALUNO","cpf":"00000000000"}' \
  --output declaracao.pdf
```

> **Nota:** envio de e-mail pode falhar localmente se o ISP bloquear SMTP. Teste o envio via Vercel.

---

## Deploy

```bash
npm run deploy
```

Requer o [Vercel CLI](https://vercel.com/cli) instalado e projeto linkado (`vercel link`).

**URL de produção:** `https://declaracao-irpf-api.vercel.app`

### Variáveis de ambiente no Vercel

Configure via dashboard ou CLI:

```bash
printf "valor" | vercel env add NOME_DA_VAR production --force
```

Variáveis necessárias: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `SPREADSHEET_ID`, `GMAIL_USER`, `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`.

---

## Google Sheets — estrutura esperada

A aba **BASE** da planilha deve conter as colunas:

| Coluna | Descrição | Exemplo |
|---|---|---|
| *(primeira)* | Nome do aluno | JOÃO DA SILVA |
| `CPF` | CPF (com ou sem formatação) | 123.456.789-00 |
| `EMAIL` | E-mail do aluno | joao@email.com |
| `Turma` | Número da turma | `1`, `2` (ou `3`+ para SEI) |
| `PARCELA` | Número da parcela | 1, 2, 3… |
| `MêS PARCELA` | Mês e ano | `janeiro-25`, `março-25` |
| `VALOR PARCELA` | Valor pago | `R$ 1.500,00` |
| `STATUS PGTO` | Status do pagamento | `PAGO` / `NÃO PAGO` |

---

## Segurança

- Credenciais armazenadas exclusivamente como variáveis de ambiente (nunca no código)
- CPF mascarado nos logs do banco (`123*****00`)
- Service account Google com escopo somente leitura (`spreadsheets.readonly`)
- Autenticação Gmail via OAuth2 — sem senha fixa armazenada
- `TEST_EMAIL` evita envio acidental a alunos reais durante desenvolvimento

---

## Licença

Proprietário — Liberdade Médica Ltda. Uso interno.
