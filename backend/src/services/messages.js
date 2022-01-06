const db = require('../db/models');
const MessagesDBApi = require('../db/api/messages');

module.exports = class MessagesService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await MessagesDBApi.create(data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let messages = await MessagesDBApi.findBy({ id }, { transaction });

      if (!messages) {
        throw new ValidationError('messagesNotFound');
      }

      await MessagesDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return messages;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      if (currentUser.role !== 'admin') {
        throw new ValidationError('errors.forbidden.message');
      }

      await MessagesDBApi.remove(id, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
