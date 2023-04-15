const db = require('../models');
const { fn, col } = require('sequelize');
const Post = db.posts;

async function create(postData) {
  const post = {
    title: postData.title,
    description: postData.description,
    link: postData.link,
    pub_date: postData.pub_date,
    guid: postData.guid,
    creator: postData.creator,
  };

  return await Post.create(post);
}

async function findAll({ page = 1, limit = 10, filters = {}, order = {} }) {
  const offset = (page - 1) * limit;
  const { count, rows } = await Post.findAndCountAll({
    where: filters,
    offset,
    limit,
    order,
  });

  return { total: count, page, limit, data: rows };
}

async function findAllCreators() {
  const creators = await Post.findAll({
    attributes: [[fn('DISTINCT', col('creator')), 'creator']],
  });

  return creators.map((creatorObj) => creatorObj.creator);
}

async function findById(id) {
  return Post.findByPk(id);
}

async function update(id, postData) {
  return Post.update(postData, {
    where: { id: id },
  });
}

async function deleteById(id) {
  return Post.destroy({
    where: { id: id },
  });
}

async function findByGuid(guid) {
  const post = await Post.findOne({
    where: {
      guid: guid,
    },
  });
  return post;
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  deleteById,
  findByGuid,
  findAllCreators,
};
