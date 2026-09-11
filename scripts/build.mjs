import { cp, mkdir, copyFile, readFile } from 'node:fs/promises';
import * as esbuild from 'esbuild';

await mkdir('dist/vendor/lucide/icons', { recursive: true });
for (const file of ['index.html', 'logo-seal.png']) await copyFile(file, 'dist/' + file);
await cp('src', 'dist/src', { recursive: true });

// three.js não publica builds minificadas próprias a partir da v0.186, então minificamos aqui.
await esbuild.build({
  entryPoints: ['node_modules/three/build/three.module.js'],
  outfile: 'dist/vendor/three.module.js',
  bundle: false,
  minify: true,
  format: 'esm',
});
await esbuild.build({
  entryPoints: ['node_modules/three/build/three.core.js'],
  outfile: 'dist/vendor/three.core.js',
  bundle: false,
  minify: true,
  format: 'esm',
});

// Copia só os ícones do Lucide que o site importa, em vez do pacote inteiro (~1500 ícones).
const iconsSource = await readFile('src/scene/icons.js', 'utf8');
const iconFiles = [...iconsSource.matchAll(/vendor\/lucide\/icons\/([\w-]+\.js)/g)].map(
  (match) => match[1]
);
await copyFile('node_modules/lucide/dist/esm/defaultAttributes.js', 'dist/vendor/lucide/defaultAttributes.js');
for (const file of iconFiles)
  await copyFile('node_modules/lucide/dist/esm/icons/' + file, 'dist/vendor/lucide/icons/' + file);
