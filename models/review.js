'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Event.belongsToMany(models.User, { foreignKey: 'UserId' })
      Event.belongsToMany(models.Book, { foreignKey: 'BookId' })
      Event.belongsToMany(models.User, { through: models.LikedReview, foreignKey: 'ReviewId' })
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
    underscored: true,
  });
  return Review;
};