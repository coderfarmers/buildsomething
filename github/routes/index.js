module.exports = app => {
    app.post('/hook', require('./github.hook.route'));
};
