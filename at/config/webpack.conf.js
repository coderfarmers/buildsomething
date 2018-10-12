const fs = require('fs')
    , ejs = require('ejs')
    , path = require('path')
    , rimraf = require('rimraf')
    , BrowserSyncPlugin = require('browser-sync-webpack-plugin')
    , ExtractTextPlugin = require('extract-text-webpack-plugin')
    , HtmlWebpackPlugin = require('html-webpack-plugin');

class WebpackConf {
    basePath = '';
    config = {
        entry: {},
        output: {},
        plugins: [],
        externals: {},
        module: {
            rules: [
                { test: /\.css$/, loader: ['style-loader', 'css-loader', 'postcss-loader'] },
                { test: /\.less$/, loader: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'] },
                { test: /\.(mp3|ttf|otf|wav)$/, loader: 'file-loader', options: { name: '[name].[ext]' } },
                { test: /\.(jpg|png|gif|svg)$/, loader: 'url-loader', options: { limit: 1, name: '[name].[ext]' } }
            ]
        },
        resolve: {
            alias: {},
            extensions: ['*', '.js', '.jsx', '.ts', '.tsx']
        },
    };

    /**
     * 相对基础路径
     */
    constructor(basePath) {
        // 设置相对路径
        if (basePath.slice(-1) !== '/') basePath += '/';
        this.basePath = basePath;
        this.config.output.filename = '[name].js';
        this.config.output.path = path.resolve(__dirname, `.${basePath}dist`);
        this.addHtmlPlugin('index.template.html', 'index.html');
        this.addAlias({
            '~components': path.resolve('./components'),
            '~vendor': path.resolve('./vendor')
        });
    }

    /**
     * 各框架添加loader
     */
    react = (filepath, opt = { tsx: true, filename: 'index.js' }) => {
        const name = this.__getFileName(filepath);
        const { tsx, filename } = opt;
        const { rules } = this.config.module;
        this.config.entry[name] = this.__pathPrefix(path.join(this.basePath, filename));
        if (!this.__findLoader('a.jsx')) rules.push({ test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ });
        if (tsx && !this.__findLoader('a.tsx')) rules.push({ test: /\.tsx?$/, loader: ['babel-loader', 'ts-loader'], exclude: /node_modules/ });

        // 模板生成react hot index
        if (fs.existsSync(this.basePath + 'index.js')) return;
        ejs.renderFile('./config/react.ejs', { app: this.__pathPrefix(filepath), root: 'app' }, {}, (err, data) => {
            if (err) throw new Error('some error in ejs template');
            fs.writeFileSync(this.basePath + 'index.js', data);
        })
    }

    /**
     * 附加依赖
     */
    // 新增html模板
    addHtmlPlugin = (temp, name) => {
        const path = this.basePath;
        this.config.plugins.push(new HtmlWebpackPlugin({ template: path + temp, name }));
    };

    // 超过size保持原样，小于size转为base64
    setBase64MaxSize = (size = 4096) => {
        const imgLoader = this.__findLoader('a.jpg');
        imgLoader.options.limit = size;
    };

    // 指定最终资源生成的目录
    setDistPath = path => this.config.output.path = path;

    // 解析路径别名
    addAlias = (name, path) => {
        if (name.constructor === String) return this.config.resolve.alias[name] = path;
        if (name.constructor === Object) return this.config.resolve.alias = name;
    };

    // 全局变量引用
    lib = (name, value) => {
        if (name.constructor === String) return this.config.externals[name] = value;
        if (name.constructor === Object) return this.config.externals = name;
    };

    /**
     * 私有方法
     */
    // 查询loader
    __findLoader = filename => {
        const { rules } = this.config.module;
        return rules.filter(item => item.test.test(filename))[0];
    };
    // 抽离css
    __extractCSS = filename => {
        const name = filename ? filename : 'style.css';
        this.__findLoader('a.css').loader = ExtractTextPlugin.extract({
            fallback: 'style-loader', use: ['css-loader', 'postcss-loader']
        });
        this.__findLoader('a.less').loader = ExtractTextPlugin.extract({
            fallback: 'style-loader', use: ['css-loader', 'postcss-loader', 'less-loader']
        });
        this.config.plugins.push(new ExtractTextPlugin(name));
    };
    // 由路径获取文件名
    __getFileName = path => path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));

    // 读取版本信息并保存新版本号
    __versionControl = () => {
        const filepath = this.basePath + '.version';
        const exists = fs.existsSync(filepath);
        this.version = exists ? fs.readFileSync(this.basePath + '.version') : 0;
        this.version++;
        fs.writeFileSync(this.basePath + '.version', this.version);
    };
    __pathPrefix = path => {
        if (path.slice(0, 2) !== './') path = './' + path;
        return path;
    };

    /**
     * 生成配置，开发or生产环境区别
     */
    dev = (opt = { browserSync: true }) => {
        const { browserSync } = opt;
        this.config.devtool = 'cheap-module-eval-source-map';
        this.config.mode = 'development';
        this.config.devServer = { host: '0.0.0.0', noInfo: true };
        if (browserSync) this.config.plugins.push(new BrowserSyncPlugin(
            { host: '0.0.0.0', port: 80, open: false, proxy: 'http://localhost:8080' },
            { reload: false })
        )
        else this.config.devServer.port = 80;
        return this.config;
    };

    prod = (publicPath, opt = { extractCSS: true, removeOld: true, version: true }) => {
        this.config.mode = 'production';
        const { extractCSS, removeOld, version } = opt;
        const outputPath = this.config.output.path;
        if (version) {
            this.__versionControl();
            this.config.output.filename = `[name].v${this.version}.js`;
        }
        if (extractCSS) this.__extractCSS(version ? `style.v${this.version}.css` : null);
        if (publicPath) this.config.output.publicPath = publicPath;
        if (removeOld) rimraf(outputPath, () => console.log(`path: "${outputPath}" is clean`));
        return this.config;
    };
}

module.exports = WebpackConf;