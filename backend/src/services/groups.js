const db = require('../db/models');
const GroupsDBApi = require('../db/api/groups');

module.exports = class GroupsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await GroupsDBApi.create(
        data,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let groups = await GroupsDBApi.findBy(
        {id},
        {transaction},
      );

      if (!groups) {
        throw new ValidationError(
          'groupsNotFound',
        );
      }

      await GroupsDBApi.update(
        id,
        data,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
      return groups;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      if (currentUser.role !== 'admin') {
        throw new ValidationError(
          'errors.forbidden.message',
        );
      }

      await GroupsDBApi.remove(
        id,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

