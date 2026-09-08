import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? walk(path.join(directory, entry.name))
          : path.join(directory, entry.name),
      ),
    )
  ).flat();
}

const files = [
  ...(await walk('src')),
  ...(await walk('scripts')),
  ...(await walk('tests')),
  'server.cjs',
];
for (const file of files.filter((file) => /\.(js|mjs|cjs)$/.test(file))) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log('Sintaxe verificada em todos os módulos.');
