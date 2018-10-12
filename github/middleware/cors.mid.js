const whiteList = [
    'http://localhost',
    'http://127.0.0.1'
];

module.exports = (req, res, next) => {
    const { origin } = req.headers;
    if (whiteList.indexOf(origin) < 0) return next();
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    next();
};
