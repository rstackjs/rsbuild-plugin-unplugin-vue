# rsbuild-plugin-unplugin-vue

Rsbuild plugin that integrates [unplugin-vue](https://github.com/unplugin/unplugin-vue) for Vue SFC compilation. Works seamlessly with both [Rsbuild](https://rsbuild.dev) and [Rslib](https://lib.rslib.dev). This plugin could be used with Rsbuild project as an alternative to [@rsbuild/plugin-vue](https://rsbuild.dev/guide/framework/vue).

> [!CAUTION]
> HMR is not supported with Rsbuild yet. Track the issue [here](https://github.com/unplugin/unplugin-vue/issues/162). This plugin is mainly used for building Vue components with Rslib as of now.

This plugin is recommended for projects using Rslib to build Vue components for the time being.

<p>
  <a href="https://npmjs.com/package/rsbuild-plugin-unplugin-vue">
   <img src="https://img.shields.io/npm/v/rsbuild-plugin-unplugin-vue?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/rsbuild-plugin-unplugin-vue?minimal=true"><img src="https://img.shields.io/npm/dm/rsbuild-plugin-unplugin-vue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

## Usage

Install:

```bash
npm add rsbuild-plugin-unplugin-vue -D
```

Add plugin to your `rsbuild.config.ts`:

```ts
// rsbuild.config.ts / rslib.config.ts
import { pluginUnpluginVue } from 'rsbuild-plugin-unplugin-vue';

export default {
  plugins: [pluginUnpluginVue()],
};
```

## Options

### unpluginVueOptions

Some description.

- Type: `import('unplugin-vue/api').Options`
- Default: `undefined`
- Example:

```js
pluginUnpluginVue({
  unpluginVueOptions: {
    include: ['**/*.vue'],
  },
});
```

## License

[MIT](./LICENSE).
