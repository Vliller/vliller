/**
 * @see https://github.com/ionic-team/ionic-app-scripts/issues/762#issuecomment-344223929
 */

const path = require('path');
const webpack = require('webpack');
const config = require('@ionic/app-scripts/config/webpack.config.js');

config.prod.plugins.push(new webpack.NormalModuleReplacementPlugin(
  /src\/environments\/environment\.ts/,
  path.resolve('./src/environments/environment.prod.ts')
));

module.exports = config;