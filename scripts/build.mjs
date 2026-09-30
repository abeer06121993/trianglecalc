import { readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

const projectRoot = process.cwd();
const outputDirectory = resolve(projectRoot, 'dist');
const serverOutputDirectory = resolve(outputDirectory, '.prerender');

if (!serverOutputDirectory.startsWith(outputDirectory + '\\')) {
  throw new Error('Refusing to use a prerender output path outside dist/.');
}

await build();

try {
  await build({
    build: {
      ssr: resolve(projectRoot, 'src/entry-server.tsx'),
      outDir: serverOutputDirectory,
      emptyOutDir: true,
    },
  });

  const serverEntry = resolve(serverOutputDirectory, 'entry-server.js');
  const { prerenderPaths, renderPrerenderedDocument } = await import(
    pathToFileURL(serverEntry).href + '?build=' + Date.now()
  );
  const template = await readFile(resolve(outputDirectory, 'index.html'), 'utf8');

  for (const pathname of prerenderPaths) {
    const html = renderPrerenderedDocument(template, pathname);
    const filename = pathname === '/' ? 'index.html' : pathname.slice(1) + '.html';
    await writeFile(resolve(outputDirectory, filename), html, 'utf8');
  }

  console.log('Prerendered routes: ' + prerenderPaths.join(', '));
} finally {
  await rm(serverOutputDirectory, { recursive: true, force: true });
}
