const Sequelize = require('sequelize');

const dbConfig = require('../config/db.config.js');

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.posts = require('./post.model.js')(sequelize, Sequelize);
db.users = require('./user.model.js')(sequelize, Sequelize);
db.refreshToken = require('../models/refreshToken.model.js')(
  sequelize,
  Sequelize
);

db.refreshToken.belongsTo(db.users, {
  foreignKey: 'userId',
  targetKey: 'id',
});
db.users.hasOne(db.refreshToken, {
  foreignKey: 'userId',
  targetKey: 'id',
});

module.exports = db;
