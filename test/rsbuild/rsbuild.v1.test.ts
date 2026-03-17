import { test } from '@playwright/test';
import {
  runRsbuildBuildTest,
  runRsbuildDevServerTest,
} from './rsbuild-test-helper';

test('should render page as expected', async ({ page }) => {
  await runRsbuildDevServerTest(
    {
      metaUrl: import.meta.url,
      version: 'v1',
    },
    page,
  );
});

test('should build succeed', async ({ page }) => {
  await runRsbuildBuildTest(
    {
      metaUrl: import.meta.url,
      version: 'v1',
    },
    page,
  );
});
