const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const initialPort = Number(process.env.PORT || 3000);
let port = initialPort;
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT precisa ser um número entre 1 e 65535.');
  process.exit(1);
}
const allowed = new Set(['index.html', 'logo-seal.png']);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};
const server = http.createServer((req, res) => {
  let file;
  try {
    file =
      decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\//, '') ||
      'index.html';
  } catch {
    res.writeHead(400);
    res.end('Requisição inválida');
    return;
  }
  const source = /^(src|assets)\/[a-zA-Z0-9_/-]+\.(js|css|svg|png)$/.test(file);
  const vendor =
    ['vendor/three.module.js', 'vendor/three.core.js'].includes(file) ||
    /^vendor\/lucide\/(?:icons\/)?[a-zA-Z0-9_.-]+\.js$/.test(file);
  if (!allowed.has(file) && !source && !vendor) {
    res.writeHead(404);
    res.end('Não encontrado');
    return;
  }
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end();
    return;
  }
  const resolved = file.startsWith('vendor/lucide/')
    ? path.join(root, 'node_modules/lucide/dist/esm', file.slice('vendor/lucide/'.length))
    : vendor
      ? path.join(root, 'node_modules/three/build', path.basename(file))
      : path.join(root, file);
  fs.readFile(resolved, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      res.end('Não foi possível abrir o arquivo');
      return;
    }
    res.writeHead(200, {
      'Content-Type': mime[path.extname(file)],
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
});
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE' && port < Math.min(initialPort + 10, 65535)) {
    console.log(`A porta ${port} já está em uso. Tentando ${port + 1}…`);
    port++;
    server.listen(port, '0.0.0.0');
    return;
  }
  console.error(
    error.code === 'EACCES' || error.code === 'EPERM'
      ? 'Sem permissão para abrir o servidor nesta porta.'
      : `Não foi possível iniciar o servidor: ${error.message}`,
  );
  process.exit(1);
});
server.on('listening', () =>
  console.log(`Anatomia de Software: http://localhost:${port}\nUse Ctrl+C para encerrar.`),
);
server.listen(port, '0.0.0.0');
