import * as R from 'ramda';
import {
  addPlugins,
  removeLoaders,
  addBeforeLoaders,
  getLoader,
  loaderByName,
  throwUnexpectedConfigError,
  OverrideWebpackConfig,
} from '@craco/craco';
import AntPlugin from '@igor-lemon/antd-scss-theme-plugin';
import cracoLess from 'craco-less';
import type { LoaderItem, PluginOptions } from './types';

const throwError = (message, githubIssueQuery) =>
  throwUnexpectedConfigError({
    packageName: 'craco-antd-scss',
    githubRepo: 'igor-lemon/craco-antd-scss',
    message,
    githubIssueQuery,
  });

export const updateLoader = ({
  webpackConfig,
  context,
  pluginOptions,
  loader,
}): void => {
  if (loader !== 'sass-loader' && loader !== 'less-loader') {
    throwError(`The "${loader}" is unknown...`, 'webpack+loader+unknown');
  }

  const webpackLoader = getLoader(webpackConfig, loaderByName(loader));

  if (!webpackLoader.isFound) {
    throwError(
      `Can't find a "${loader}" in the ${context.env} webpack config!`,
      'webpack+loader+sass'
    );
  }

  let loaderOptions;

  if (loader === 'sass-loader') {
    loaderOptions = 'sassLoaderOptions';
  } else {
    loaderOptions = 'lessLoaderOptions';
  }

  const baseLoader: LoaderItem = R.path(['match', 'loader'], webpackLoader);
  const options = R.prop(loaderOptions, pluginOptions);
  let stylesLoader = baseLoader;

  // User want to skip modifying this loader
  if (options === null) {
    return;
  }

  if (!R.isEmpty(options) && typeof options === 'object') {
    const optionsLens = R.lensProp<LoaderItem>('options');

    const updatedOptions = R.compose(
      R.mergeDeepLeft(options),
      R.propOr({}, 'options')
    )(baseLoader);

    stylesLoader = R.set(optionsLens, updatedOptions, baseLoader);
  }

  const antStylesLoader = AntPlugin.themify(stylesLoader);

  addBeforeLoaders(webpackConfig, loaderByName(loader), antStylesLoader);

  removeLoaders(webpackConfig, loaderByName(loader));
};

export const checkOneOfRule = ({ webpackConfig, context }) => {
  const oneOfRule =
    R.hasPath(['module', 'rules']) &&
    R.compose(
      R.find(R.has('oneOf')),
      R.path(['module', 'rules'])
    )(webpackConfig);

  if (!oneOfRule) {
    throwError(
      "Can't find a 'oneOf' rule under module.rules in the " +
        `${context.env} webpack config!`,
      'webpack+rules+oneOf'
    );
  }
};

export const overrideWebpackConfig: OverrideWebpackConfig<PluginOptions> = ({
  context,
  webpackConfig,
  pluginOptions,
}) => {
  cracoLess.overrideWebpackConfig({
    context,
    webpackConfig,
    pluginOptions,
  });

  const themeFilePath = R.prop('theme', pluginOptions);

  if (!themeFilePath) {
    throwError(
      "You don't set path to the SCSS theme file",
      'plugin+options+theme'
    );
  }

  checkOneOfRule({ webpackConfig, context });

  updateLoader({
    webpackConfig,
    context,
    pluginOptions,
    loader: 'sass-loader',
  });

  updateLoader({
    webpackConfig,
    context,
    pluginOptions,
    loader: 'less-loader',
  });

  addPlugins(webpackConfig, [new AntPlugin(themeFilePath)]);

  return webpackConfig;
};

export const overrideCracoConfig = ({ cracoConfig, pluginOptions }) => {
  let config;

  const baseImportPluginImportOptions = {
    libraryName: 'antd',
    libraryDirectory: 'lib',
    style: true,
  };

  const options = R.prop('babelImportOptions', pluginOptions);

  if (options && typeof options !== 'object') {
    throwError(
      `Incorrect babelImportOptions configurations...`,
      'webpack+babel+babelImportOptions'
    );
  }

  const babelPluginImportOptions = R.mergeRight(
    baseImportPluginImportOptions,
    options
  );

  const hasPlugins = R.hasPath(['babel', 'plugins'], cracoConfig);

  const babelPlugin = ['import', babelPluginImportOptions];

  if (hasPlugins) {
    const pluginsLens = R.lensPath(['babel', 'plugins']);

    config = R.compose(
      R.set(pluginsLens, R.__, cracoConfig),
      R.append(babelPlugin),
      R.path(['babel', 'plugins'])
    )(cracoConfig);
  } else {
    config = R.set(
      R.lensPath(['babel', 'plugins']),
      [babelPlugin],
      cracoConfig
    );
  }

  return config;
};
