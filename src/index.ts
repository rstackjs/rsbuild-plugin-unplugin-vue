import type { RsbuildPlugin } from '@rsbuild/core';
import type { Options } from 'unplugin-vue/api';
import { parseVueRequest } from 'unplugin-vue/api';
import RspackPluginVue from 'unplugin-vue/rspack';

export type PluginUnpluginVueOptions = {
  unpluginVueOptions?: Options;
};

const isVirtualModule = (request?: string) => {
  if (!request) return false;

  return (
    /[\\/]node_modules[\\/].virtual/.test(request) || request.startsWith('\0')
  );
};

// Preprocessor defined rule in `lib` field will be suffixed with self-increasing serial number.
// e.g. less, less-1, sass-2.
const isPreprocessorRule = (
  preprocessRuleId: string,
  toMatchRuleId: string,
) => {
  if (preprocessRuleId === toMatchRuleId) {
    return true;
  }

  if (new RegExp(`${preprocessRuleId}-\\d`).test(toMatchRuleId)) {
    return true;
  }

  return false;
};

const isScopedStyle = (request?: string) => {
  if (!request) return false;

  const { query } = parseVueRequest(request);
  return query.type === 'style' || query.lang === 'css';
};

const getStyleRuleBranchIds = (ruleId: string) => {
  const baseRuleId = ruleId.replace(/-\d+$/, '');
  return [baseRuleId, `${baseRuleId}-inline`, `${baseRuleId}-raw`];
};

export const pluginUnpluginVue = ({
  unpluginVueOptions,
}: PluginUnpluginVueOptions = {}): RsbuildPlugin => ({
  name: 'plugin-unplugin-vue',
  setup(api) {
    const callerName = api.context.callerName;
    const isRslib = callerName === 'rslib';
    const isRsbuildV1 = api.context.version?.startsWith('1.') ?? true;

    api.modifyRspackConfig((config, utils) => {
      config.plugins?.push(RspackPluginVue(unpluginVueOptions));
    });

    api.modifyBundlerChain({
      handler: (config, { CHAIN_ID }) => {
        for (const ruleId in config.module.rules.entries()) {
          if (
            CHAIN_ID.RULE.CSS === ruleId ||
            isPreprocessorRule(CHAIN_ID.RULE.LESS, ruleId) ||
            isPreprocessorRule(CHAIN_ID.RULE.SASS, ruleId) ||
            isPreprocessorRule(CHAIN_ID.RULE.STYLUS, ruleId)
          ) {
            const baseRule = config.module.rule(ruleId);

            if (isRsbuildV1) {
              baseRule.enforce('post');
              continue;
            }

            for (const branchId of getStyleRuleBranchIds(ruleId)) {
              baseRule.oneOf(branchId).enforce('post');
            }
          }
        }

        config.resolve.extensions.add('.vue');
      },
      order: 'post',
    });

    // Rslib bundleless specific config, will only be used in bundleless mode
    if (isRslib) {
      api.modifyRspackConfig((config) => {
        if (Array.isArray(config.externals)) {
          config.externals.unshift(async (data, callback) => {
            const { request, context } = data;
            let result = false;

            if (isVirtualModule(request) || isVirtualModule(context)) {
              result = true;
            } else if (isScopedStyle(request)) {
              result = true;
            }

            if (result) {
              return callback(undefined, false);
            }

            callback();
          });
        }
      });

      api.processAssets({ stage: 'additional' }, ({ assets, compilation }) => {
        for (const key of Object.keys(assets)) {
          if (isVirtualModule(key)) {
            compilation.deleteAsset(key);
          }
        }
      });
    }
  },
});
