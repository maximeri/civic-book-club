'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.hasMany(models.User, { foreignKey: 'UserId' })
      Review.hasMany(models.Book, { foreignKey: 'BookId' })
      Review.belongsToMany(models.User, { through: models.LikedReview, foreignKey: 'ReviewId' })
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