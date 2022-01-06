const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const reaction = sequelize.define(
    'reaction',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.ENUM,

        values: [
          'like',

          'dislike',

          'love',

          'sad',

          'care',

          'haha',

          'wow',

          'angry',
        ],
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

  reaction.associate = (db) => {
    db.reaction.belongsTo(db.users, {
      as: 'user',
      constraints: false,
    });

    db.reaction.belongsTo(db.posts, {
      as: 'post',
      constraints: false,
    });

    db.reaction.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.reaction.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return reaction;
};
