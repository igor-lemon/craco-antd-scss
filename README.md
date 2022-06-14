# Craco Ant Design SCSS plugin
[![NPM Version](https://badge.fury.io/js/@igor-lemon%2Fcraco-antd-scss.svg)](https://badge.fury.io/js/@igor-lemon%2Fcraco-antd-scss)
[![Tests Status](https://github.com/igor-lemon/craco-antd-scss/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/igor-lemon/craco-antd-scss/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/igor-lemon/craco-antd-scss/badge.svg?branch=master)](https://coveralls.io/github/igor-lemon/craco-antd-scss?branch=master)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## About
`@igor-lemon/craco-antd-scss` is a [Craco](https://github.com/sharegate/craco) plugin which allows you to use SASS/SCSS in your [create-react-app](https://facebook.github.io/create-react-app/) `^5.0.0` projects with [Ant Design](https://github.com/ant-design/ant-design/).

The plugin based on [@igor-lemon/antd-scss-theme-plugin](https://github.com/igor-lemon/antd-scss-theme-plugin) and [craco-less](https://github.com/DocSpring/craco-less) plugins.

## Installation

If you don't have `craco` you should to [install it before](https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#installation).
<br/>
Then install `@igor-lemon/craco-antd-scss`:

```bash
$ yarn add @igor-lemon/craco-antd-scss --save-dev

# OR

$ npm i @igor-lemon/craco-antd-scss --save-dev
```

## How to use

Create `theme.scss`. It's file where you can override antd variables.
<br/>
And modify your `craco.config.js` config file.

```js
const CracoAntSCSSPlugin = require('@igor-lemon/craco-antd-scss');

module.exports = {
  plugins: [
    { 
      plugin: CracoAntSCSSPlugin, 
      options: { theme: './path_to/theme.scss' }
    }
  ],
};
```

For example put into `theme.scss` next variables
```scss
$primary-color: #92021F;
$link-color: #D3840D;
```

The list of variables you can find here: [https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)


## Configuration options

### `theme` 
- *Required*. The path to the file with the variables you want to override.


### `lessOptions` 
Custom Less options. [https://webpack.js.org/loaders/less-loader/#options](https://webpack.js.org/loaders/less-loader/#options)
<br/>
Default:
```js
{}
````
Set `null` if you don't want to apply `@igor-lemon/antd-scss-theme-plugin` to the Less loader.

### `sassOptions` 
Custom SASS/SCSS options. [https://webpack.js.org/loaders/sass-loader/#options](https://webpack.js.org/loaders/sass-loader/#options)
<br/>
Default:
```js
{}
````
Set `null` if you don't want to apply `@igor-lemon/antd-scss-theme-plugin` to the Less loader.

###  `babelImportOptions`
Babel Import plugin [options](https://github.com/umijs/babel-plugin-import#options).
<br/>
Default:
```js
{
  libraryName: 'antd',
  libraryDirectory: 'lib',
  style: true
}
```

## Additional Features

The plugin allows to use Ant Design variables in your SASS/SCSS files.
<br/>
If you want to use it feature just import `theme.scss`

Example:

```scss
@import "./path_to/theme";

.wrapper {
  background-color: $body-background;
  margin: $margin-md;
}
```

*The disadvantage of this approach is that the IDE and linters doesn't see the values of these variables. 
It may not be so convenient to use them.*

My advice is to just overwrite the used variables in `theme.scss` and set `sassOptions` option to `null`, this will reduce the rebuilding time.

```js
const CracoAntSCSSPlugin = require('@igor-lemon/craco-antd-scss');

module.exports = {
  plugins: [
    { 
      plugin: CracoAntSCSSPlugin, 
      options: {
        sassLoaderOptions: null,
        theme: './path_to/theme.scss'
      }
    }
  ],
};
```

## License

[MIT](./LICENSE)
