@echo off
REM Script de Setup Automático - Declaração IRPF API
REM Windows PowerShell/CMD

echo ================================================
echo  Setup Automatico - Declaracao IRPF API
echo ================================================
echo.

REM Criar estrutura de pastas
echo [1/6] Criando estrutura de pastas...
mkdir api 2>nul
mkdir data 2>nul
mkdir docs 2>nul
echo    ✓ Pastas criadas

REM Criar .gitignore
echo.
echo [2/6] Criando .gitignore...
(
echo # Dependências
echo node_modules/
echo package-lock.json
echo.
echo # Vercel
echo .vercel/
echo.
echo # Credenciais
echo .env
echo .env.local
echo *.json.bak
echo *service-account*.json
echo.
echo # Logs
echo *.log
echo npm-debug.log*
echo.
echo # Sistema
echo .DS_Store
echo Thumbs.db
echo.
echo # IDEs
echo .vscode/
echo .idea/
echo.
echo # Claude Code
echo .claude/
) > .gitignore
echo    ✓ .gitignore criado

REM Criar .env.example
echo.
echo [3/6] Criando .env.example...
(
echo # Google Sheets Configuration
echo GOOGLE_SERVICE_ACCOUNT_EMAIL=seu-service-account@projeto.iam.gserviceaccount.com
echo GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"
echo SPREADSHEET_ID=seu_spreadsheet_id_aqui
echo.
echo # INSTRUÇÕES:
echo # 1. Copie para .env: copy .env.example .env
echo # 2. Preencha com credenciais reais
echo # 3. Siga docs/CONFIGURAR_GOOGLE_SHEETS.md
) > .env.example
echo    ✓ .env.example criado

REM Inicializar Git
echo.
echo [4/6] Inicializando Git...
git init >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Git inicializado
) else (
    echo    ✗ Git não encontrado - instale em: https://git-scm.com
)

REM Verificar Node.js
echo.
echo [5/6] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✓ Node.js instalado
) else (
    echo    ✗ Node.js não encontrado - instale em: https://nodejs.org
    goto :end
)

REM Instalar dependências
echo.
echo [6/6] Instalando dependências...
if exist package.json (
    echo    Executando npm install...
    call npm install
    if %errorlevel% equ 0 (
        echo    ✓ Dependências instaladas
    ) else (
        echo    ✗ Erro ao instalar dependências
    )
) else (
    echo    ✗ package.json não encontrado
    echo    Copie package_sheets.json para package.json primeiro
)

:end
echo.
echo ================================================
echo  Setup Concluído!
echo ================================================
echo.
echo Próximos passos:
echo.
echo 1. Copie os arquivos para as pastas corretas:
echo    - api_declaracao_sheets.js ^> api/declaracao.js
echo    - package_sheets.json ^> package.json
echo    - vercel_sheets.json ^> vercel.json
echo    - Template.docx ^> data/Recibo_IRPF_2025.docx
echo.
echo 2. Configure credenciais:
echo    copy .env.example .env
echo    notepad .env
echo.
echo 3. Teste localmente:
echo    vercel dev
echo.
echo 4. Leia a documentação:
echo    docs/INICIO_RAPIDO_GOOGLE_SHEETS.md
echo.
pause
