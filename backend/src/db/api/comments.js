const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class CommentsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const comments = await db.comments.create(
      {
        id: data.id || undefined,

        content: data.content || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await comments.setPost(data.post || null, {
      transaction,
    });

    await comments.setAuthor(data.author || null, {
      transaction,
    });

    return comments;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const comments = await db.comments.findByPk(id, {
      transaction,
    });

    await comments.update(
      {
        content: data.content || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await comments.setPost(data.post || null, {
      transaction,
    });

    await comments.setAuthor(data.author || null, {
      transaction,
    });

    return comments;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const comments = await db.comments.findByPk(id, options);

    await comments.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await comments.destroy({
      transaction,
    });

    return comments;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const comments = await db.comments.findOne({ where }, { transaction });

    if (!comments) {
      return comments;
    }

    const output = comments.get({ plain: true });

    output.post = await comments.getPost({
      transaction,
    });

    output.author = await comments.getAuthor({
      transaction,
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
        model: db.posts,
        as: 'post',
      },

      {
        model: db.users,
        as: 'author',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.content) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('comments', 'content', filter.content),
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
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.post) {
        var listItems = filter.post.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          postId: { [Op.or]: listItems },
        };
      }

      if (filter.author) {
        var listItems = filter.author.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          authorId: { [Op.or]: listItems },
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

    let { rows, count } = await db.comments.findAndCountAll({
      where,
      include,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: orderBy ? [orderBy.split('_')] : [['createdAt', 'DESC']],
      transaction,
    });

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
          Utils.ilike('comments', 'content', query),
        ],
      };
    }

    const records = await db.comments.findAll({
      attributes: ['id', 'content'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['content', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.content,
    }));
  }
};
