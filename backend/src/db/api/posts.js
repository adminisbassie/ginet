const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class PostsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const posts = await db.posts.create(
      {
        id: data.id || undefined,

        title: data.title || null,
        content: data.content || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await posts.setGroup(data.group || null, {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.posts.getTableName(),
        belongsToColumn: 'images',
        belongsToId: posts.id,
      },
      data.images,
      options,
    );

    return posts;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const posts = await db.posts.findByPk(id, {
      transaction,
    });

    await posts.update(
      {
        title: data.title || null,
        content: data.content || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await posts.setGroup(data.group || null, {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.posts.getTableName(),
        belongsToColumn: 'images',
        belongsToId: posts.id,
      },
      data.images,
      options,
    );

    return posts;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const posts = await db.posts.findByPk(id, options);

    await posts.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await posts.destroy({
      transaction,
    });

    return posts;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const posts = await db.posts.findOne({ where }, { transaction });

    if (!posts) {
      return posts;
    }

    const output = posts.get({ plain: true });

    output.images = await posts.getImages({
      transaction,
    });

    output.group = await posts.getGroup({
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
        model: db.groups,
        as: 'group',
      },

      {
        model: db.file,
        as: 'images',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.title) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('posts', 'title', filter.title),
        };
      }

      if (filter.content) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('posts', 'content', filter.content),
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

      if (filter.group) {
        var listItems = filter.group.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          groupId: { [Op.or]: listItems },
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

    let { rows, count } = await db.posts.findAndCountAll({
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
          Utils.ilike('posts', 'title', query),
        ],
      };
    }

    const records = await db.posts.findAll({
      attributes: ['id', 'title'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['title', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.title,
    }));
  }
};
