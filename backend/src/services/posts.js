const db = require('../db/models');
const PostsDBApi = require('../db/api/posts');

module.exports = class PostsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await PostsDBApi.create(data, {
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
      let posts = await PostsDBApi.findBy({ id }, { transaction });

      if (!posts) {
        throw new ValidationError('postsNotFound');
      }

      await PostsDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return posts;
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

      await PostsDBApi.remove(id, {
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
