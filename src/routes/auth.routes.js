const auth = require('../controllers/auth.controller');
const router = require('express').Router();

module.exports = (app) => {
  router.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });
  router.post('/login', auth.signin);
  router.post('/refreshtoken', auth.refreshToken);

  app.use('/auth', router);
};
