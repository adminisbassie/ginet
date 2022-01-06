
const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class GroupsDBApi {

  static async create(data, options) {
  const currentUser = (options && options.currentUser) || { id: null };
  const transaction = (options && options.transaction) || undefined;

  const groups = await db.groups.create(
  {
  id: data.id || undefined,

    name: data.name
    ||
    null
,

    description: data.description
    ||
    null
,

  importHash: data.importHash || null,
  createdById: currentUser.id,
  updatedById: currentUser.id,
  },
  { transaction },
  );

    await FileDBApi.replaceRelationFiles(
    {
    belongsTo: db.groups.getTableName(),
    belongsToColumn: 'images',
    belongsToId: groups.id,
    },
    data.images,
    options,
    );

  return groups;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || {id: null};
    const transaction = (options && options.transaction) || undefined;

    const groups = await db.groups.findByPk(id, {
      transaction,
    });

    await groups.update(
      {

        name: data.name
        ||
        null
,

        description: data.description
        ||
        null
,

        updatedById: currentUser.id,
      },
      {transaction},
    );

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.groups.getTableName(),
        belongsToColumn: 'images',
        belongsToId: groups.id,
      },
      data.images,
      options,
    );

    return groups;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || {id: null};
    const transaction = (options && options.transaction) || undefined;

    const groups = await db.groups.findByPk(id, options);

    await groups.update({
      deletedBy: currentUser.id
    }, {
      transaction,
    });

    await groups.destroy({
      transaction
    });

    return groups;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const groups = await db.groups.findOne(
      { where },
      { transaction },
    );

    if (!groups) {
      return groups;
    }

    const output = groups.get({plain: true});

    output.images = await groups.getImages({
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

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'groups',
            'name',
            filter.name,
          ),
        };
      }

      if (filter.description) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'groups',
            'description',
            filter.description,
          ),
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

    let { rows, count } = await db.groups.findAndCountAll(
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
            'groups',
            'name',
            query,
          ),
        ],
      };
    }

    const records = await db.groups.findAll({
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

