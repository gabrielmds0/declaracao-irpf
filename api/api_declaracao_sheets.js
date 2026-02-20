/**
 * API de Declaração IRPF - Node.js + Google Sheets + Vercel
 * api/api_declaracao_sheets.js
 *
 * Lê dados direto do Google Sheets em tempo real e gera PDF via Puppeteer
 */

const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// Carrega imagens como base64 para embed inline no HTML (necessário no Vercel)
function carregarImagemBase64(nomeArquivo) {
    try {
        const caminho = path.join(__dirname, '..', 'data', nomeArquivo);
        return fs.readFileSync(caminho).toString('base64');
    } catch {
        return null;
    }
}

const IMG_LOGO      = carregarImagemBase64('liberdade_medica_logo.webp');
const IMG_ASSINATURA = carregarImagemBase64('signature.png');
const IMG_WATERMARK  = carregarImagemBase64('watermark.png');

// ==================== CONFIGURAÇÕES ====================

const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// ==================== FUNÇÕES AUXILIARES ====================

function formatarCPF(cpf) {
    const limpo = String(cpf).replace(/\D/g, '');
    if (limpo.length === 11) {
        return `${limpo.substr(0, 3)}.${limpo.substr(3, 3)}.${limpo.substr(6, 3)}-${limpo.substr(9, 2)}`;
    }
    return cpf;
}

function formatarMoeda(valor) {
    return `R$ ${parseFloat(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function obterMesPorExtenso(numeroMes) {
    const meses = {
        1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril',
        5: 'Maio', 6: 'Junho', 7: 'Julho', 8: 'Agosto',
        9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro'
    };
    return meses[parseInt(numeroMes)] || String(numeroMes);
}

function verificarTurma(turma) {
    const turmaUpper = String(turma).toUpperCase().trim();
    // Aceita: T1, T2, 1, 2
    return turmaUpper === 'T1' || turmaUpper === 'T2' || turmaUpper === '1' || turmaUpper === '2';
}

// ==================== TEMPLATE HTML ====================

function gerarHTMLDeclaracao(dados) {
    const linhasParcelas = [];
    for (let i = 1; i <= 12; i++) {
        if (dados[`valor_${i}`] !== '') {
            linhasParcelas.push(`
                <tr>
                    <td class="td-center">${dados[`parcela_${i}`]}</td>
                    <td>${dados[`mes_${i}`]}/2025</td>
                    <td class="td-right">${dados[`valor_${i}`]}</td>
                </tr>`);
        }
    }

    const dataAtual = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    const logoSrc      = IMG_LOGO       ? `data:image/webp;base64,${IMG_LOGO}`       : '';
    const assinaruraSrc = IMG_ASSINATURA ? `data:image/png;base64,${IMG_ASSINATURA}`  : '';
    const wmStyle = IMG_WATERMARK
        ? `background-image: url('data:image/png;base64,${IMG_WATERMARK}');
           background-repeat: no-repeat;
           background-position: center center;
           background-size: 55%;`
        : '';

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
        font-family: 'Arial', sans-serif;
        font-size: 10.5pt;
        color: #222;
        background: #fff;
    }

    /* Watermark via pseudo-element para não afetar conteúdo */
    body::before {
        content: '';
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        ${wmStyle}
        opacity: 0.06;
        pointer-events: none;
        z-index: 0;
    }

    .page {
        position: relative;
        z-index: 1;
        padding: 18mm 18mm 14mm 18mm;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    /* ── CABEÇALHO ── */
    .header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding-bottom: 12px;
        border-bottom: 1.5px solid #222;
        margin-bottom: 22px;
    }
    .header-logo img {
        height: 52px;
        width: auto;
    }
    .header-info {
        text-align: right;
        font-size: 8.5pt;
        color: #333;
        line-height: 1.65;
    }
    .header-info .empresa-nome {
        font-size: 10.5pt;
        font-weight: bold;
        color: #111;
        margin-bottom: 3px;
    }

    /* ── TÍTULO ── */
    .titulo-bloco {
        text-align: center;
        margin-bottom: 20px;
    }
    .titulo-bloco .titulo {
        font-size: 12.5pt;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #111;
    }
    .titulo-bloco .subtitulo {
        font-size: 9pt;
        color: #555;
        margin-top: 4px;
    }

    /* ── DADOS DO CONTRIBUINTE ── */
    .dados-contribuinte {
        margin-bottom: 18px;
        padding: 10px 14px;
        border: 1px solid #ddd;
        border-radius: 3px;
        background: #fafafa;
    }
    .dados-contribuinte table { width: 100%; border: none; }
    .dados-contribuinte td   { border: none; padding: 3px 0; font-size: 10pt; }
    .dados-contribuinte td.label { color: #555; width: 130px; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.3px; }
    .dados-contribuinte td.valor { font-weight: bold; color: #111; }

    /* ── TABELA DE PAGAMENTOS ── */
    .tabela {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 18px;
        font-size: 10pt;
    }
    .tabela thead tr {
        background: #111;
        color: #fff;
    }
    .tabela th {
        padding: 8px 12px;
        font-weight: 600;
        letter-spacing: 0.3px;
    }
    .tabela th:first-child, .td-center { text-align: center; }
    .tabela th:last-child,  .td-right  { text-align: right;  }
    .tabela td {
        padding: 6px 12px;
        border-bottom: 1px solid #e8e8e8;
        color: #222;
    }
    .tabela tr:last-child td { border-bottom: none; }
    .total-row td {
        padding: 8px 12px;
        font-weight: bold;
        color: #111;
        border-top: 1.5px solid #222;
        font-size: 10.5pt;
    }

    /* ── TEXTO DECLARATÓRIO ── */
    .texto-declaratorio {
        font-size: 9.5pt;
        color: #333;
        line-height: 1.75;
        text-align: justify;
        margin-bottom: 28px;
    }

    /* ── ASSINATURA ── */
    .assinatura-bloco {
        margin-top: auto;
        padding-top: 20px;
    }
    .cidade-data {
        font-size: 9.5pt;
        color: #444;
        margin-bottom: 14px;
    }
    .assinatura-conteudo {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0;
    }
    .assinatura-img {
        height: 56px;
        width: auto;
        display: block;
        margin-bottom: -4px;
    }
    .assinatura-linha {
        border-top: 1px solid #555;
        padding-top: 6px;
        min-width: 280px;
    }
    .assinatura-linha .nome-empresa {
        font-weight: bold;
        font-size: 10pt;
        color: #111;
    }
    .assinatura-linha .dados-empresa {
        font-size: 8pt;
        color: #555;
        line-height: 1.6;
        margin-top: 2px;
    }

    @page { size: A4; margin: 0; }
</style>
</head>
<body>
<div class="page">

    <!-- CABEÇALHO -->
    <div class="header">
        <div class="header-logo">
            ${logoSrc ? `<img src="${logoSrc}" alt="Liberdade Médica">` : '<span style="font-size:14pt;font-weight:bold;">LIBERDADE MÉDICA</span>'}
        </div>
        <div class="header-info">
            <div class="empresa-nome">LIBERDADE MÉDICA LTDA</div>
            <div>CNPJ: 40.070.030/0001-99</div>
            <div>R 9, Nº 625, Quadra 27, Lote 73</div>
            <div>Setor Central, Goiânia - GO, CEP 74.013-040</div>
            <div>Telefone: (62) 98139-6751</div>
            <div>financeiro@liberdademedica.edu.br</div>
        </div>
    </div>

    <!-- TÍTULO -->
    <div class="titulo-bloco">
        <div class="titulo">Declaração de Pagamentos Efetuados a Pessoa Jurídica</div>
        <div class="subtitulo">Ano-Calendário 2025 — Para fins de dedução na Declaração do IRPF</div>
    </div>

    <!-- DADOS DO CONTRIBUINTE -->
    <div class="dados-contribuinte">
        <table>
            <tr>
                <td class="label">Contribuinte</td>
                <td class="valor">${dados.nome}</td>
            </tr>
            <tr>
                <td class="label">CPF</td>
                <td class="valor">${dados.cpf}</td>
            </tr>
        </table>
    </div>

    <!-- TABELA DE PAGAMENTOS -->
    <table class="tabela">
        <thead>
            <tr>
                <th style="width:80px;">Parcela</th>
                <th>Mês de Referência</th>
                <th style="width:160px;">Valor Pago</th>
            </tr>
        </thead>
        <tbody>
            ${linhasParcelas.join('')}
            <tr class="total-row">
                <td colspan="2">Total pago no ano-calendário 2025</td>
                <td class="td-right">${dados.total}</td>
            </tr>
        </tbody>
    </table>

    <!-- TEXTO DECLARATÓRIO -->
    <p class="texto-declaratorio">
        Declaramos, para os devidos fins e efeitos legais, que <strong>${dados.nome}</strong>,
        CPF <strong>${dados.cpf}</strong>, efetuou pagamentos à <strong>Liberdade Médica LTDA</strong>
        — CNPJ 40.070.030/0001-99 — no ano-calendário de 2025, no valor total de
        <strong>${dados.total}</strong>, conforme discriminado na tabela acima.
        Este documento é válido como comprovante de despesas dedutíveis na Declaração Anual de
        Ajuste do Imposto de Renda Pessoa Física (IRPF), nos termos da legislação vigente.
    </p>

    <!-- ASSINATURA -->
    <div class="assinatura-bloco">
        <div class="cidade-data">Goiânia - GO, ${dataAtual}</div>
        <div class="assinatura-conteudo">
            ${assinaruraSrc ? `<img class="assinatura-img" src="${assinaruraSrc}" alt="Assinatura">` : '<div style="height:56px;"></div>'}
            <div class="assinatura-linha">
                <div class="nome-empresa">LIBERDADE MÉDICA LTDA</div>
                <div class="dados-empresa">
                    CNPJ: 40.070.030/0001-99<br>
                    (62) 98139-6751 &nbsp;|&nbsp; financeiro@liberdademedica.edu.br
                </div>
            </div>
        </div>
    </div>

</div>
</body>
</html>`;
}

// ==================== GOOGLE SHEETS ====================

async function conectarGoogleSheets() {
    try {
        const serviceAccountAuth = new JWT({
            email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: GOOGLE_PRIVATE_KEY,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
        await doc.loadInfo();

        console.log('[Google Sheets] Conectado:', doc.title);
        return doc;

    } catch (error) {
        console.error('[Google Sheets] Erro ao conectar:', error.message);
        throw new Error('Erro ao conectar com Google Sheets');
    }
}

// Parseia "janeiro-25" → { mes: 1, ano: 2025 }
function parsearMesAno(mesAnoStr) {
    const mesesPT = {
        'janeiro': 1, 'fevereiro': 2, 'março': 3, 'abril': 4,
        'maio': 5, 'junho': 6, 'julho': 7, 'agosto': 8,
        'setembro': 9, 'outubro': 10, 'novembro': 11, 'dezembro': 12
    };
    if (!mesAnoStr) return { mes: 0, ano: 0 };
    const partes = String(mesAnoStr).toLowerCase().split('-');
    const mes = mesesPT[partes[0]] || 0;
    const ano = partes[1] ? 2000 + parseInt(partes[1]) : 0;
    return { mes, ano };
}

// Parseia "R$ 1.500,00" → 1500.00
function parsearValor(valorStr) {
    if (!valorStr) return 0;
    return parseFloat(String(valorStr).replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
}

// Retorna { turma, dadosFinanceiros } em uma única chamada ao Sheets.
// A turma vem da primeira linha do aluno (sem filtros), os dados financeiros
// são filtrados por ano=2025 e status=PAGO.
async function buscarDadosAluno(cpf = null, nome = null, email = null) {
    try {
        const doc = await conectarGoogleSheets();
        const sheet = doc.sheetsById[972200278];
        await sheet.loadHeaderRow();
        const colunaNome = sheet.headerValues[0];
        const rows = await sheet.getRows();

        console.log(`[Google Sheets] Aba: ${sheet.title} | Total de linhas: ${rows.length}`);

        // 1. Filtrar pelo aluno (sem filtro de ano/status)
        let rowsAluno = rows;
        if (cpf) {
            const cpfLimpo = String(cpf).replace(/\D/g, '');
            rowsAluno = rows.filter(row =>
                String(row.get('CPF') || '').replace(/\D/g, '') === cpfLimpo
            );
        } else if (nome) {
            rowsAluno = rows.filter(row =>
                String(row.get(colunaNome) || '').toLowerCase().includes(nome.toLowerCase())
            );
        } else if (email) {
            rowsAluno = rows.filter(row =>
                String(row.get('EMAIL') || '').toLowerCase() === email.toLowerCase()
            );
        }

        console.log(`[Filtro Aluno] Linhas encontradas: ${rowsAluno.length}`);

        if (rowsAluno.length === 0) return { turma: null, dadosFinanceiros: [] };

        // 2. Turma real vem da primeira linha (independente de ano/status)
        const turma = String(rowsAluno[0].get('Turma') || '').trim();
        console.log(`[Turma] Turma real do aluno na planilha: ${turma}`);

        // 3. Filtrar por 2025 e PAGO para o PDF
        const rowsFiltradas = rowsAluno
            .filter(row => parsearMesAno(row.get('MêS PARCELA')).ano === 2025)
            .filter(row => String(row.get('STATUS PGTO') || '').toUpperCase() === 'PAGO');

        console.log(`[Filtro 2025+PAGO] Parcelas encontradas: ${rowsFiltradas.length}`);

        const dadosFinanceiros = rowsFiltradas.map(row => {
            const { mes, ano } = parsearMesAno(row.get('MêS PARCELA'));
            return {
                Nome: row.get(colunaNome),
                CPF: row.get('CPF'),
                Email: row.get('EMAIL'),
                Turma: row.get('Turma'),
                Parcela: parseInt(row.get('PARCELA') || 0),
                Mes: mes,
                Ano: ano,
                Valor: parsearValor(row.get('VALOR PARCELA')),
                Status: row.get('STATUS PGTO')
            };
        });

        return { turma, dadosFinanceiros };

    } catch (error) {
        console.error('[Google Sheets] Erro ao buscar dados:', error.message);
        throw error;
    }
}

function calcularTotal(dadosFinanceiros) {
    return dadosFinanceiros.reduce((sum, row) => sum + parseFloat(row.Valor || 0), 0);
}

function prepararDadosParcelas(dadosFinanceiros) {
    const dados = {};

    dadosFinanceiros.sort((a, b) => a.Parcela - b.Parcela);

    dadosFinanceiros.slice(0, 12).forEach((row, index) => {
        const num = index + 1;
        dados[`parcela_${num}`] = String(row.Parcela);
        dados[`mes_${num}`] = obterMesPorExtenso(row.Mes);
        dados[`valor_${num}`] = formatarMoeda(row.Valor);
    });

    for (let i = dadosFinanceiros.length + 1; i <= 12; i++) {
        dados[`parcela_${i}`] = '';
        dados[`mes_${i}`] = '';
        dados[`valor_${i}`] = '';
    }

    return dados;
}

// ==================== GERAÇÃO DE PDF ====================

async function gerarDeclaracao(dadosAluno) {
    let browser = null;
    try {
        console.log('[Geração] Iniciando para:', dadosAluno.nome);

        // 1. Buscar turma real + dados financeiros em uma única chamada ao Sheets
        console.log('[Google Sheets] Buscando dados do aluno...');
        const { turma, dadosFinanceiros } = await buscarDadosAluno(
            dadosAluno.cpf,
            dadosAluno.nome,
            dadosAluno.email
        );

        // 2. Aluno não encontrado na base
        if (!turma) {
            console.log('[Erro] Aluno não encontrado na base de dados');
            return {
                success: false,
                erro: 'Aluno não encontrado na base de dados'
            };
        }

        // 3. Verificar turma (SEI = 3, 4, 5... → tutorial; T1/T2 → PDF)
        if (!verificarTurma(turma)) {
            console.log(`[Turma] Turma SEI (${turma}) detectada - encaminhar tutorial`);
            return {
                success: true,
                tipo: 'tutorial',
                turma,
                mensagem: 'Turma SEI - enviar tutorial escrito'
            };
        }

        // 4. T1 ou T2 — verificar se há pagamentos em 2025
        if (dadosFinanceiros.length === 0) {
            console.log('[Erro] Nenhum pagamento PAGO encontrado para 2025');
            return {
                success: false,
                erro: 'Nenhum pagamento encontrado para 2025'
            };
        }

        console.log(`[Sucesso] ${dadosFinanceiros.length} parcelas encontradas para turma ${turma}`);

        // 5. Calcular total
        const valorTotal = calcularTotal(dadosFinanceiros);
        console.log(`[Total] R$ ${valorTotal.toFixed(2)}`);

        // 6. Preparar dados das parcelas
        const dadosParcelas = prepararDadosParcelas(dadosFinanceiros);

        // 7. Montar dados completos para o template HTML
        const dadosTemplate = {
            nome: dadosAluno.nome,
            cpf: formatarCPF(dadosAluno.cpf),
            turma,
            total: formatarMoeda(valorTotal),
            ...dadosParcelas
        };

        // 8. Gerar HTML
        const html = gerarHTMLDeclaracao(dadosTemplate);

        // 9. Lançar Puppeteer
        // Em produção (Vercel): usa @sparticuz/chromium
        // Local (Windows/Mac): usa Chrome/Chromium instalado
        console.log('[PDF] Iniciando Puppeteer...');
        const localChromes = [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
        ];
        const localChrome = localChromes.find(p => fs.existsSync(p));

        let executablePath, launchArgs, launchViewport;
        if (localChrome) {
            executablePath = localChrome;
            launchArgs = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];
            launchViewport = null;
        } else {
            // Vercel / serverless — @sparticuz/chromium v133+
            chromium.setHeadlessMode = true;
            chromium.setGraphicsMode = false;
            executablePath = await chromium.executablePath();
            launchArgs = chromium.args;
            launchViewport = chromium.defaultViewport;
        }

        browser = await puppeteer.launch({
            args: launchArgs,
            defaultViewport: launchViewport,
            executablePath,
            headless: true,
        });

        // 10. Renderizar HTML e exportar como PDF
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
        });

        console.log('[PDF] Documento gerado com sucesso');

        return {
            success: true,
            tipo: 'declaracao',
            buffer: pdfBuffer,
            nomeArquivo: `Declaracao_IRPF_${dadosAluno.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_')}_${Date.now()}.pdf`,
            totalParcelas: dadosFinanceiros.length,
            valorTotal: formatarMoeda(valorTotal),
            mensagem: 'Declaração PDF gerada com sucesso!'
        };

    } catch (error) {
        console.error('[Erro] Erro ao gerar declaração:', error);
        return {
            success: false,
            erro: error.message
        };
    } finally {
        if (browser) await browser.close();
    }
}

// ==================== ENDPOINT VERCEL ====================

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET - Health check OU geração de PDF via query params (para Blip)
    if (req.method === 'GET') {
        const { nome, cpf, email } = req.query || {};

        // Se não tiver cpf/nome → health check
        if (!cpf && !nome) {
            return res.status(200).json({
                status: 'online',
                service: 'API Declaração IRPF - Google Sheets + PDF',
                version: '3.0.0',
                timestamp: new Date().toISOString(),
                googleSheets: SPREADSHEET_ID ? 'configurado' : 'não configurado'
            });
        }

        // Com parâmetros → gera PDF (turma detectada automaticamente pela planilha)
        if (!nome || !cpf) {
            return res.status(400).json({
                success: false,
                erro: 'Campos obrigatórios: nome, cpf'
            });
        }

        try {
            console.log('\n========================================');
            console.log('[Request GET] Blip/URL solicitação:', {
                nome,
                cpf: cpf.replace(/\d(?=\d{4})/g, '*'),
                timestamp: new Date().toISOString()
            });
            console.log('========================================\n');

            const resultado = await gerarDeclaracao({ nome, cpf, email });

            if (resultado.success && resultado.tipo === 'declaracao') {
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${resultado.nomeArquivo}"`);
                res.setHeader('Content-Length', resultado.buffer.length);
                res.statusCode = 200;
                return res.end(resultado.buffer);
            } else {
                return res.status(resultado.success ? 200 : 400).json(resultado);
            }
        } catch (error) {
            console.error('[Erro Fatal GET]', error);
            return res.status(500).json({
                success: false,
                erro: 'Erro interno do servidor',
                detalhes: error.message
            });
        }
    }

    // POST - Gerar declaração
    if (req.method === 'POST') {
        try {
            const { nome, cpf, email } = req.body;

            if (!nome || !cpf) {
                return res.status(400).json({
                    success: false,
                    erro: 'Campos obrigatórios: nome, cpf'
                });
            }

            if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !SPREADSHEET_ID) {
                console.error('[Config] Variáveis de ambiente não configuradas');
                return res.status(500).json({
                    success: false,
                    erro: 'Configuração do Google Sheets incompleta'
                });
            }

            console.log('\n========================================');
            console.log('[Request] Nova solicitação:', {
                nome,
                cpf: cpf.replace(/\d(?=\d{4})/g, '*'),
                timestamp: new Date().toISOString()
            });
            console.log('========================================\n');

            const resultado = await gerarDeclaracao({ nome, cpf, email });

            if (resultado.success && resultado.tipo === 'declaracao') {
                // ?format=base64 → retorna JSON (para Blip e integrações similares)
                // padrão           → retorna PDF binário (para download direto)
                const formatoBase64 = req.query && req.query.format === 'base64';

                if (formatoBase64) {
                    console.log('[Response] Enviando base64 JSON:', resultado.nomeArquivo);
                    return res.status(200).json({
                        success: true,
                        filename: resultado.nomeArquivo,
                        contentType: 'application/pdf',
                        pdf: resultado.buffer.toString('base64'),
                        totalParcelas: resultado.totalParcelas,
                        valorTotal: resultado.valorTotal
                    });
                }

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${resultado.nomeArquivo}"`);
                res.setHeader('Content-Length', resultado.buffer.length);
                console.log('[Response] Enviando PDF:', resultado.nomeArquivo, `(${resultado.buffer.length} bytes)`);
                res.statusCode = 200;
                return res.end(resultado.buffer);
            } else {
                console.log('[Response] Retorno:', resultado);
                return res.status(resultado.success ? 200 : 400).json(resultado);
            }

        } catch (error) {
            console.error('[Erro Fatal]', error);
            return res.status(500).json({
                success: false,
                erro: 'Erro interno do servidor',
                detalhes: error.message
            });
        }
    }

    return res.status(405).json({
        erro: 'Método não permitido'
    });
};
