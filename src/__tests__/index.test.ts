import * as R from 'ramda';
import craPaths from 'react-scripts/config/paths';
import { loadWebpackDevConfig } from '@craco/craco/lib/cra';
import {
  applyCracoConfigPlugins,
  applyWebpackConfigPlugins,
} from '@craco/craco/lib/features/plugins';
import AntPlugin from '@igor-lemon/antd-scss-theme-plugin';
import { CracoConfig, loaderByName, removeLoaders } from '@craco/craco';
import type { RuleSetRule, RuleSetConditionAbsolute } from 'webpack';
import * as plugin from '../index';
import type { LoaderItem } from '../index';
import { checkOneOfRule, overrideCracoConfig, updateLoader } from '../index';
import path from 'path';

let webpackConfig;
let cracoConfig;
let originalWebpackConfig;

const context = { env: 'development', paths: craPaths };

beforeEach(() => {
  if (!originalWebpackConfig) {
    process.env.NODE_ENV = 'development';
    originalWebpackConfig = loadWebpackDevConfig({
      reactScriptsVersion: 'react-scripts',
    });
    process.env.NODE_ENV = 'test';
  }

  webpackConfig = R.clone(originalWebpackConfig);
});

const applyCracoConfigAndOverrideWebpack = (config: CracoConfig) => {
  cracoConfig = applyCracoConfigPlugins(config, context);
  webpackConfig = applyWebpackConfigPlugins(
    cracoConfig,
    webpackConfig,
    context
  );
};

const getOneOfRule = (): Array<RuleSetRule> => {
  const oneOf = R.compose(
    R.find(R.hasIn('oneOf')),
    R.pathOr([], ['module', 'rules'])
  )(webpackConfig);

  if (oneOf) {
    return R.prop('oneOf', oneOf);
  }

  return;
};

const getRuleByCondition = (
  condition: RuleSetConditionAbsolute
): RuleSetRule | undefined => {
  const oneOf = getOneOfRule();

  if (oneOf && oneOf.length > 0) {
    return R.find(
      (item) => R.has('test', item) && R.propEq('test', condition, item),
      oneOf
    );
  }

  return;
};

const getAntLoader = (
  condition: RuleSetConditionAbsolute
): LoaderItem | undefined => {
  const rule = getRuleByCondition(condition);

  if (rule && R.has('use', rule)) {
    return R.compose(
      R.find(R.compose(R.test(/antd-scss-theme-plugin/), R.prop('loader'))),
      R.prop('use')
    )(rule);
  }

  return;
};

const lessLoaderOptions = {
  sourceMap: false,
  lessOptions: {
    modifyVars: {
      '@primary-color': '#1DA57A',
      '@link-color': '#1DA57A',
      '@border-radius-base': '2px',
    },
    javascriptEnabled: true,
  },
};

const saasLoaderOptions = {
  sourceMap: false,
  postcssOptions: {
    ident: 'postcss',
    config: false,
  },
};

const options = {
  lessLoaderOptions,
  saasLoaderOptions,
  theme: path.resolve('./theme.scss'),
};

const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

describe('Test Craco Ant Design SCSS plugin', () => {
  describe('Test common plugin options', () => {
    test('Correct config should have oneOf object', () => {
      applyCracoConfigAndOverrideWebpack({
        plugins: [
          {
            plugin,
            options,
          },
        ],
      });

      const oneOfRule = getOneOfRule();

      expect(oneOfRule).not.toBeUndefined();
    });
    test('Should exits webpack plugin record', () => {
      applyCracoConfigAndOverrideWebpack({
        plugins: [
          {
            plugin,
            options: {
              theme: path.resolve('./theme.scss'),
            },
          },
        ],
      });

      expect(webpackConfig.plugins).toEqual(
        expect.arrayContaining([new AntPlugin(path.resolve('./theme.scss'))])
      );
    });
    test('Should exits babel record', () => {
      applyCracoConfigAndOverrideWebpack({
        plugins: [
          {
            plugin,
            options: {
              theme: path.resolve('./theme.scss'),
            },
          },
        ],
      });

      const babelConfig = R.path(['babel', 'plugins'], cracoConfig);

      expect(babelConfig).toEqual(
        expect.arrayContaining([
          [
            'import',
            { libraryDirectory: 'lib', libraryName: 'antd', style: true },
          ],
        ])
      );
    });
    test('Should correct babel override record', () => {
      applyCracoConfigAndOverrideWebpack({
        plugins: [
          {
            plugin,
            options: {
              theme: path.resolve('./theme.scss'),
              babelImportOptions: {
                libraryDirectory: 'es',
              },
            },
          },
        ],
      });

      const babelConfig = R.path(['babel', 'plugins'], cracoConfig);

      expect(babelConfig).toEqual(
        expect.arrayContaining([
          [
            'import',
            { libraryDirectory: 'es', libraryName: 'antd', style: true },
          ],
        ])
      );
    });
    test('Should correct add babel record', () => {
      const config = overrideCracoConfig({
        cracoConfig: {
          babel: {
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
        pluginOptions: {
          theme: path.resolve('./theme.scss'),
          babelImportOptions: {
            libraryDirectory: 'es',
          },
        },
      });

      expect(config).toEqual({
        babel: {
          plugins: [
            '@babel/plugin-transform-runtime',
            [
              'import',
              { libraryDirectory: 'es', libraryName: 'antd', style: true },
            ],
          ],
        },
      });
    });
  });
  describe('Test LESS loaders', () => {
    test('Correct config should have LESS loaders', () => {
      applyCracoConfigAndOverrideWebpack({
        plugins: [
          {
            plugin,
            options,
          },
        ],
      });

      const lessRule = getRuleByCondition(lessRegex);
      const lessModuleRule = getRuleByCondition(lessModuleRegex);

      expect(lessRule).not.toBeUndefined();
      expect(lessModuleRule).not.toBeUndefined();

      expect(lessRule).not.toBeUndefined();
      expect(lessModuleRule).not.toBeUndefined();
    });
    test('Correct config should have Ant LESS loaders', () => {
      applyCracoConfigAndOverrideWebpack({
        plugins: [
          {
            plugin,
            options,
          },
        ],
      });

      const lessAntRule = getAntLoader(lessRegex);
      const lessAntModuleRule = getAntLoader(lessModuleRegex);

      expect(lessAntRule).not.toBeUndefined();
      expect(lessAntModuleRule).not.toBeUndefined();
    });
    test('Should set correct LESS options [base]', () => {
      applyCracoConfigAndOverrideWebpack({
        plugins: [
          {
            plugin,
            options: {
              theme: path.resolve('./theme.scss'),
            },
          },
        ],
      });

      const lessAntLoader = getAntLoader(lessRegex);
      const lessAntLoaderOptions = R.prop('options', lessAntLoader);

      expect(lessAntLoaderOptions).toEqual({ sourceMap: true });
    });
    test('Should set correct LESS options [override]', () => {
      applyCracoConfigAndOverrideWebpack({
        plugins: [
          {
            plugin,
            options: {
              lessLoaderOptions,
              theme: path.resolve('./theme.scss'),
            },
          },
        ],
      });

      const lessAntLoader = getAntLoader(lessRegex);
      const lessAntLoaderOptions = R.prop('options', lessAntLoader);

      expect(lessAntLoaderOptions).toEqual(lessLoaderOptions);
    });
    test('Should not set ant LESS loader if user set "null" option', () => {
      applyCracoConfigAndOverrideWebpack({
        plugins: [
          {
            plugin,
            options: {
              lessLoaderOptions: null,
              theme: path.resolve('./theme.scss'),
            },
          },
        ],
      });

      const lessAntLoader = getAntLoader(lessRegex);
      const lessModuleAntLoader = getAntLoader(lessModuleRegex);

      expect(lessAntLoader).toBe(undefined);
      expect(lessModuleAntLoader).toBe(undefined);
    });
  });
  describe('Test SASS/SCSS loaders', () => {
    test('Correct config should have SASS/SCSS loaders', () => {
      applyCracoConfigAndOverrideWebpack({
        plugins: [
          {
            plugin,
            options,
          },
        ],
      });

      const sassRule = getRuleByCondition(sassRegex);
      const sassModuleRule = getRuleByCondition(sassModuleRegex);

      expect(sassRule).not.toBeUndefined();
      expect(sassModuleRule).not.toBeUndefined();
    });
    test('Correct config should have Ant SASS/SCSS loaders', () => {
      applyCracoConfigAndOverrideWebpack({
        plugins: [
          {
            plugin,
            options,
          },
        ],
      });

      const sassAntRule = getAntLoader(sassRegex);
      const sassAntModuleRule = getAntLoader(sassModuleRegex);

      expect(sassAntRule).not.toBeUndefined();
      expect(sassAntModuleRule).not.toBeUndefined();
    });
    test('Should set correct SASS/SCSS options [base]', () => {
      applyCracoConfigAndOverrideWebpack({
        plugins: [
          {
            plugin,
            options: {
              theme: path.resolve('./theme.scss'),
            },
          },
        ],
      });

      const sassAntLoader = getAntLoader(sassRegex);
      const sassAntLoaderOptions = R.prop('options', sassAntLoader);

      expect(sassAntLoaderOptions).toEqual({ sourceMap: true });
    });
    test('Should set correct SASS/SCSS options [override]', () => {
      applyCracoConfigAndOverrideWebpack({
        plugins: [
          {
            plugin,
            options: {
              saasLoaderOptions,
              theme: path.resolve('./theme.scss'),
            },
          },
        ],
      });

      const sassAntLoader = getAntLoader(sassRegex);
      const sassAntLoaderOptions = R.prop('options', sassAntLoader);

      expect(sassAntLoaderOptions).toEqual(saasLoaderOptions);
    });
    test('Should not set ant SASS/SCSS loader if user set "null" option', () => {
      applyCracoConfigAndOverrideWebpack({
        plugins: [
          {
            plugin,
            options: {
              saasLoaderOptions: null,
              theme: path.resolve('./theme.scss'),
            },
          },
        ],
      });

      const sassAntLoader = getAntLoader(sassRegex);
      const sassModuleAntLoader = getAntLoader(sassModuleRegex);

      expect(sassAntLoader).toBe(undefined);
      expect(sassModuleAntLoader).toBe(undefined);
    });
  });
  describe('Catch errors', () => {
    test('Do not set theme file path', () => {
      const runner = () =>
        applyCracoConfigAndOverrideWebpack({
          plugins: [
            {
              plugin,
            },
          ],
        });

      expect(runner).toThrowError(/^You don't set path to the SCSS theme file/);
    });
    test('Do not have oneOf object in webpack config', () => {
      const runner = () =>
        checkOneOfRule({ webpackConfig: { module: { rules: {} } }, context });

      expect(runner).toThrowError(
        /^Can't find a 'oneOf' rule under module.rules in the development webpack config!/
      );
    });
    test('Incorrect babel plugin config', () => {
      const runner = () =>
        applyCracoConfigAndOverrideWebpack({
          plugins: [
            {
              plugin,
              options: {
                theme: path.resolve('./theme.scss'),
                babelImportOptions: 'foo-bar-incorrect',
              },
            },
          ],
        });

      expect(runner).toThrowError(
        /^Incorrect babelImportOptions configurations.../
      );
    });
    test('Do not find styles loader in config', () => {
      const loader = 'sass-loader';

      removeLoaders(webpackConfig, loaderByName(loader));

      const runner = () =>
        updateLoader({
          webpackConfig,
          context,
          pluginOptions: {
            theme: path.resolve('./theme.scss'),
            babelImportOptions: 'foo-bar-incorrect',
          },
          loader,
        });

      expect(runner).toThrowError(
        /^Can't find a "sass-loader" in the development webpack config!/
      );
    });
    test('Try to set ant for incorrect styles loader', () => {
      const runner = () =>
        updateLoader({
          webpackConfig,
          context,
          pluginOptions: {
            theme: path.resolve('./theme.scss'),
            babelImportOptions: 'foo-bar-incorrect',
          },
          loader: 'foo-loader',
        });

      expect(runner).toThrowError(/^The "foo-loader" is unknown.../);
    });
  });
});
