const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const posts = sequelize.define(
    'posts',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.TEXT,
      },

      content: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  posts.associate = (db) => {
    db.posts.belongsTo(db.groups, {
      as: 'group',
      constraints: false,
    });

    db.posts.hasMany(db.file, {
      as: 'images',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.posts.getTableName(),
        belongsToColumn: 'images',
      },
    });

    db.posts.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.posts.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return posts;
};
