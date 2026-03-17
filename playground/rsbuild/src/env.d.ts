/// <reference types="@rsbuild/core/types" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  // biome-ignore lint/complexity/noBannedTypes: reason
  // biome-ignore lint/suspicious/noExplicitAny: Vue component typings use `any` here.
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
