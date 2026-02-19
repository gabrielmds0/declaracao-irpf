/**
 * Servidor local para testar a API antes do deploy
 * Uso: node server.js  (ou: npm run dev)
 */
require('dotenv').config();
const http = require('http');
const handler = require('./api/api_declaracao_sheets');

const PORT = 3000;

// Adiciona métodos Express-like ao res nativo do Node.js
function wrapResponse(res) {
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
        return res;
    };
    res.send = (data) => {
        if (Buffer.isBuffer(data)) {
            res.end(data);
        } else if (typeof data === 'object') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        } else {
            res.end(String(data));
        }
        return res;
    };
    return res;
}

const server = http.createServer((req, res) => {
    wrapResponse(res);

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        if (body) {
            try { req.body = JSON.parse(body); } catch { req.body = {}; }
        } else {
            req.body = {};
        }
        handler(req, res).catch(err => {
            console.error('Erro no handler:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
        });
    });
});

server.listen(PORT, () => {
    console.log(`\n✅ Servidor rodando em http://localhost:${PORT}`);
    console.log('\nHealth check:');
    console.log(`  curl http://localhost:${PORT}/api/declaracao`);
    console.log('\nGerar declaração (salva PDF):');
    console.log(`  curl -X POST http://localhost:${PORT}/api/declaracao \\`);
    console.log(`    -H "Content-Type: application/json" \\`);
    console.log(`    -d "{\\\"nome\\\":\\\"NOME DO ALUNO\\\",\\\"cpf\\\":\\\"CPF_SEM_PONTOS\\\",\\\"turma\\\":\\\"T1\\\"}" \\`);
    console.log(`    --output declaracao.pdf\n`);
});
