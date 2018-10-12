const fs = require('fs');
const path = require('path');
require('@babel/register')(JSON.parse(fs.readFileSync('./config/.babelrc')));
const WebpackConfig = require('./config/webpack.conf');

const config = new WebpackConfig('./src');
config.react('app.tsx');
config.lib({
    'react': 'React',
    'react-dom': 'ReactDOM'
});
config.setDistPath(path.resolve(__dirname, './dist'));

module.exports = process.env.NODE_ENV === 'production' ? config.prod() : config.dev();
