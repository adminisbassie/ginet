
const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class ReactionDBApi {

  static async create(data, options) {
  const currentUser = (options && options.currentUser) || { id: null };
  const transaction = (options && options.transaction) || undefined;

  const reaction = await db.reaction.create(
  {
  id: data.id || undefined,

    name: data.name
    ||
    null
,

  importHash: data.importHash || null,
  createdById: currentUser.id,
  updatedById: currentUser.id,
  },
  { transaction },
  );

    await reaction.setUser(data.user || null, {
    transaction,
    });

    await reaction.setPost(data.post || null, {
    transaction,
    });

  return reaction;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || {id: null};
    const transaction = (options && options.transaction) || undefined;

    const reaction = await db.reaction.findByPk(id, {
      transaction,
    });

    await reaction.update(
      {

        name: data.name
        ||
        null
,

        updatedById: currentUser.id,
      },
      {transaction},
    );

    await reaction.setUser(data.user || null, {
      transaction,
    });

    await reaction.setPost(data.post || null, {
      transaction,
    });

    return reaction;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || {id: null};
    const transaction = (options && options.transaction) || undefined;

    const reaction = await db.reaction.findByPk(id, options);

    await reaction.update({
      deletedBy: currentUser.id
    }, {
      transaction,
    });

    await reaction.destroy({
      transaction
    });

    return reaction;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const reaction = await db.reaction.findOne(
      { where },
      { transaction },
    );

    if (!reaction) {
      return reaction;
    }

    const output = reaction.get({plain: true});

    output.user = await reaction.getUser({
      transaction
    });

    output.post = await reaction.getPost({
      transaction
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    if (filter.page != 1 && filter.page) {
    const currentPage = +filter.page - 1;
    offset = currentPage * limit;
    }
    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [

      {
        model: db.users,
        as: 'user',
      },

      {
        model: db.posts,
        as: 'post',
      },

    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active:
            filter.active === true ||
            filter.active === 'true',
        };
      }

      if (filter.name) {
        where = {
          ...where,
          name: filter.name,
        };
      }

      if (filter.user) {
        var listItems = filter.user.split('|').map(item => {
          return  Utils.uuid(item)
        });

        where = {
          ...where,
          userId: {[Op.or]: listItems}
        };
      }

      if (filter.post) {
        var listItems = filter.post.split('|').map(item => {
          return  Utils.uuid(item)
        });

        where = {
          ...where,
          postId: {[Op.or]: listItems}
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = await db.reaction.findAndCountAll(
      {
        where,
        include,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        order: orderBy
          ? [orderBy.split('_')]
          : [['createdAt', 'DESC']],
        transaction,
      },
    );

//    rows = await this._fillWithRelationsAndFilesForRows(
//      rows,
//      options,
//    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike(
            'reaction',
            'name',
            query,
          ),
        ],
      };
    }

    const records = await db.reaction.findAll({
      attributes: [ 'id', 'name' ],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }

};

