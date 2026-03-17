import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type Page, expect } from '@playwright/test';
import { createRsbuild } from '@rsbuild/core';
import { createRsbuild as createRsbuildV1 } from '@rsbuild/core-v1';
import { pluginUnpluginVue } from '../../src';

const portMap = new Map();

export function getRandomPort(
  defaultPort = Math.ceil(Math.random() * 30000) + 15000,
) {
  let port = defaultPort;
  while (true) {
    if (!portMap.get(port)) {
      portMap.set(port, 1);
      return port;
    }
    port++;
  }
}

type RsbuildVersion = 'v1' | 'v2';

type RsbuildTestOptions = {
  metaUrl: string;
  version: RsbuildVersion;
};

const getRsbuildTestConfig = (version: RsbuildVersion) => {
  if (version === 'v1') {
    return {
      createRsbuild: createRsbuildV1,
      distRoot: 'dist-v1',
    };
  }

  return {
    createRsbuild,
    distRoot: 'dist-v2',
  };
};

const createRsbuildInstance = async ({
  metaUrl,
  version,
}: RsbuildTestOptions) => {
  const cwd = dirname(fileURLToPath(metaUrl));
  const { createRsbuild, distRoot } = getRsbuildTestConfig(version);

  return createRsbuild({
    cwd,
    rsbuildConfig: {
      plugins: [pluginUnpluginVue()],
      output: {
        cleanDistPath: true,
        distPath: {
          root: distRoot,
        },
      },
      server: {
        port: getRandomPort(),
      },
    },
  });
};

export const runRsbuildDevServerTest = async (
  options: RsbuildTestOptions,
  page: Page,
) => {
  const rsbuild = await createRsbuildInstance(options);
  const { server, urls } = await rsbuild.startDevServer();

  await page.goto(urls[0]);
  const h1 = page.locator('h1');
  await expect(h1).toHaveText('Rsbuild with Vue');

  await server.close();
};

export const runRsbuildBuildTest = async (
  options: RsbuildTestOptions,
  page: Page,
) => {
  const rsbuild = await createRsbuildInstance(options);

  await rsbuild.build();
  const { server, urls } = await rsbuild.preview();

  await page.goto(urls[0]);
  const h1 = page.locator('h1');
  await expect(h1).toHaveText('Rsbuild with Vue');

  await server.close();
};
