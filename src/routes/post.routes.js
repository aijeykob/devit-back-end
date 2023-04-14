const posts = require('../controllers/post.controller.js');
const authJwt = require('../middleware/authJwt');

const router = require('express').Router();
router.use(authJwt.verifyToken);

module.exports = (app) => {
  router.post('/', posts.create);
  router.post('/get-all', posts.findAll);
  router.get('/:id', posts.findOne);
  router.put('/:id', posts.update);
  router.delete('/:id', posts.deleteById);
  app.use('/api/posts', router);
};
