'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, { foreignKey: 'userId' })
      Review.belongsTo(models.Book, { foreignKey: 'bookId' })
      Review.belongsToMany(models.User, { through: models.LikedReview, foreignKey: 'reviewId', as: 'LikedReviewUsers' })
    }
  }
  Review.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    user_id: DataTypes.NUMBER,
    book_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'Reviews',
    underscored: true,
  });
  return Review;
};