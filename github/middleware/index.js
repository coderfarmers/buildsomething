module.exports = app => {
//   app.use(require('./cors.mid'));
  app.use(require('./self-define-header.mid'));
  app.use(require('body-parser').json());
};
