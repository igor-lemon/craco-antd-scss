import { LoaderContext } from 'webpack';

declare type LoaderItem = {
  loader: string;
  options: any;
  ident: null | string;
  type: null | string;
}

declare type lessOptions =
  | import('less').options
  | ((loaderContext: LoaderContext<any>) => import('less').options);
declare type sassOptions =
    | import("sass").LegacyOptions<"async">
    | ((
    content: string | Buffer,
    loaderContext: LoaderContext<any>,
    meta: any
) => import("sass").LegacyOptions<"async">);

declare type additionalData =
  | string
  | ((content: string, loaderContext: LoaderContext<any>) => string);
declare type sourceMap = boolean;
declare type webpackImporter = boolean;
declare type implementation = object | string;
declare type api = "legacy" | "modern";
declare type warnRuleAsWarning = boolean;

declare type LessOptions = {
  lessOptions?: lessOptions;
  additionalData?: additionalData;
  sourceMap: sourceMap;
  webpackImporter?: webpackImporter;
  implementation?: implementation;
};

declare type SassOptions = {
  implementation?: implementation;
  sassOptions?: sassOptions;
  sourceMap: sourceMap;
  additionalData?: additionalData;
  webpackImporter?: webpackImporter;
  warnRuleAsWarning?: warnRuleAsWarning;
  api?: api;
};

declare type BabelImportOptions = {
  libraryName: string,
  style?: boolean | "css", (string, Object): string | boolean,
  libraryDirectory?: string,
  styleLibraryDirectory?: string,
  customName?: (string, Object) => string,
  customStyleName?: (string, Object) => string,
  transformToDefaultImport?: boolean,
  camel2DashComponentName?: boolean,
}

declare type PluginOptions = {
  saasLoaderOptions?: SassOptions,
  lessLoaderOptions?: LessOptions,
  babelImportOptions?: BabelImportOptions,
  theme: string
}

