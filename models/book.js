'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.hasMany(models.Review, { foreignKey: 'bookId' })
      Book.hasMany(models.Event, { foreignKey: 'bookId' })
      Book.belongsToMany(models.User, { through: models.LikedBook, foreignKey: 'bookId', as: 'LikedBookUsers' })
    }
  }
  Book.init({
    name: DataTypes.STRING,
    isbn: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
    tableName: 'Books',
    underscored: true,
  });
  return Book;
};