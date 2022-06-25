'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // define association here
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