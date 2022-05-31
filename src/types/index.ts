import { LoaderContext } from 'webpack';

export type LoaderItem = {
  loader: string;
  options: string | { [index: string]: any };
  ident: null | string;
  type: null | string;
};

export type lessOptions =
  | import('less').options
  | ((loaderContext: LoaderContext<any>) => import('less').options);
export type sassOptions =
  | import('sass').LegacyOptions<'async'>
  | ((
      content: string | Buffer,
      loaderContext: LoaderContext<any>,
      meta: any
    ) => import('sass').LegacyOptions<'async'>);

export type additionalData =
  | string
  | ((content: string, loaderContext: LoaderContext<any>) => string);
export type sourceMap = boolean;
export type webpackImporter = boolean;
export type implementation = object | string;
export type api = 'legacy' | 'modern';
export type warnRuleAsWarning = boolean;

export type LessOptions = {
  lessOptions?: lessOptions;
  additionalData?: additionalData;
  sourceMap: sourceMap;
  webpackImporter?: webpackImporter;
  implementation?: implementation;
};

export type SassOptions = {
  implementation?: implementation;
  sassOptions?: sassOptions;
  sourceMap: sourceMap;
  additionalData?: additionalData;
  webpackImporter?: webpackImporter;
  warnRuleAsWarning?: warnRuleAsWarning;
  api?: api;
};

export type BabelImportOptions = {
  libraryName: string;
  style?: boolean | 'css';
  (string, Object): string | boolean;
  libraryDirectory?: string;
  styleLibraryDirectory?: string;
  customName?: (string, Object) => string;
  customStyleName?: (string, Object) => string;
  transformToDefaultImport?: boolean;
  camel2DashComponentName?: boolean;
};

export type PluginOptions = {
  sassLoaderOptions?: SassOptions;
  lessLoaderOptions?: LessOptions;
  babelImportOptions?: BabelImportOptions;
  theme: string;
};
