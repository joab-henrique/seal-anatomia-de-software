import { cp, mkdir, copyFile } from 'node:fs/promises';

await mkdir('dist/vendor', { recursive: true });
for (const file of ['index.html', 'logo-seal.png']) await copyFile(file, 'dist/' + file);
await cp('src', 'dist/src', { recursive: true });
for (const file of ['three.module.js', 'three.core.js'])
  await copyFile('node_modules/three/build/' + file, 'dist/vendor/' + file);
console.log('Site pronto em dist/. Publique o conteúdo dessa pasta em uma hospedagem estática.');
