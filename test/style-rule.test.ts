import { expect, test } from '@playwright/test';
import { getStyleRuleBranchIds } from '../src/style-rule';

test('should keep suffixed style rule ids intact', () => {
  expect(getStyleRuleBranchIds('less-1')).toEqual([
    'less-1',
    'less-1-inline',
    'less-1-raw',
  ]);
});

test('should return css branches for unsuffixed style rules', () => {
  expect(getStyleRuleBranchIds('css')).toEqual([
    'css',
    'css-inline',
    'css-raw',
  ]);
});
