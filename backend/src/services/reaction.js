const db = require('../db/models');
const ReactionDBApi = require('../db/api/reaction');

module.exports = class ReactionService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await ReactionDBApi.create(data, {
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
      let reaction = await ReactionDBApi.findBy({ id }, { transaction });

      if (!reaction) {
        throw new ValidationError('reactionNotFound');
      }

      await ReactionDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return reaction;
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

      await ReactionDBApi.remove(id, {
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
