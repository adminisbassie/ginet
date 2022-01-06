const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class MessagesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const messages = await db.messages.create(
      {
        id: data.id || undefined,

        body: data.body || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await messages.setFrom(data.from || null, {
      transaction,
    });

    await messages.setTo(data.to || null, {
      transaction,
    });

    return messages;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const messages = await db.messages.findByPk(id, {
      transaction,
    });

    await messages.update(
      {
        body: data.body || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await messages.setFrom(data.from || null, {
      transaction,
    });

    await messages.setTo(data.to || null, {
      transaction,
    });

    return messages;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const messages = await db.messages.findByPk(id, options);

    await messages.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await messages.destroy({
      transaction,
    });

    return messages;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const messages = await db.messages.findOne({ where }, { transaction });

    if (!messages) {
      return messages;
    }

    const output = messages.get({ plain: true });

    output.from = await messages.getFrom({
      transaction,
    });

    output.to = await messages.getTo({
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
        model: db.users,
        as: 'from',
      },

      {
        model: db.users,
        as: 'to',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.body) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('messages', 'body', filter.body),
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

      if (filter.from) {
        var listItems = filter.from.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          fromId: { [Op.or]: listItems },
        };
      }

      if (filter.to) {
        var listItems = filter.to.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          toId: { [Op.or]: listItems },
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

    let { rows, count } = await db.messages.findAndCountAll({
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
          Utils.ilike('messages', 'body', query),
        ],
      };
    }

    const records = await db.messages.findAll({
      attributes: ['id', 'body'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['body', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.body,
    }));
  }
};
