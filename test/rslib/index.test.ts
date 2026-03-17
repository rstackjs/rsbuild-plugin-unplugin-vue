import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { createRslib } from '@rslib/core';
import { pluginUnpluginVue } from '../../src';

const __dirname = dirname(fileURLToPath(import.meta.url));

test('ESM should build succeed', async () => {
  const rslib = await createRslib({
    cwd: __dirname,
    config: {
      lib: [
        {
          format: 'esm',
          plugins: [pluginUnpluginVue()],
          output: {
            target: 'web',
            externals: ['vue'],
          },
        },
      ],
    },
  });

  await rslib.build();

  const distFiles = await fs.promises.readdir(`${__dirname}/dist`);
  expect(distFiles.sort()).toEqual([
    'index.css',
    'index.js',
    'rslib-runtime.js',
  ]);

  const jsContent = await fs.promises.readFile(
    `${__dirname}/dist/index.js`,
    'utf-8',
  );

  expect(jsContent.includes('Rsbuild with Vue')).toBeTruthy();

  const cssContent = await fs.promises.readFile(
    `${__dirname}/dist/index.css`,
    'utf-8',
  );
  expect(cssContent.includes('.content {')).toBeTruthy();
});
