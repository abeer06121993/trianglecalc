import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, '..');
const outputDirectory = resolve(projectRoot, 'dist');
const serverOutputDirectory = resolve(outputDirectory, '.prerender');

// Project-relative Vite and PostCSS configuration must resolve from this project,
// even when the build script is launched from another working directory.
process.chdir(projectRoot);

function assertInsideOutputDirectory(outputPath) {
  const relativePath = relative(outputDirectory, outputPath);
  if (
    relativePath === '' ||
    relativePath === '..' ||
    relativePath.startsWith('..' + sep) ||
    isAbsolute(relativePath)
  ) {
    throw new Error('Refusing to use a prerender output path outside dist/.');
  }
}

assertInsideOutputDirectory(serverOutputDirectory);

await build({ root: projectRoot });

try {
  await build({
    root: projectRoot,
    build: {
      ssr: resolve(projectRoot, 'src/entry-server.tsx'),
      outDir: serverOutputDirectory,
      emptyOutDir: true,
    },
  });

  const serverEntry = resolve(serverOutputDirectory, 'entry-server.js');
  assertInsideOutputDirectory(serverEntry);
  const { prerenderPaths, renderPrerenderedDocument } = await import(
    pathToFileURL(serverEntry).href + '?build=' + Date.now()
  );
  const template = await readFile(resolve(outputDirectory, 'index.html'), 'utf8');

  for (const pathname of prerenderPaths) {
    const html = renderPrerenderedDocument(template, pathname);
    const outputPath = pathname === '/'
      ? resolve(outputDirectory, 'index.html')
      : resolve(outputDirectory, pathname.slice(1), 'index.html');
    assertInsideOutputDirectory(outputPath);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html, 'utf8');
  }

  console.log('Prerendered routes: ' + prerenderPaths.join(', '));
} finally {
  await rm(serverOutputDirectory, { recursive: true, force: true });
}
