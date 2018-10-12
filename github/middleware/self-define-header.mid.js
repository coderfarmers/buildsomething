module.exports = (req, res, next) => {
    res.header('Server', 'Chr-Server/1.0.0-alpha');
    res.header('X-Powered-By', 'Chreem <chreem@qq.com>');
    next();
};
