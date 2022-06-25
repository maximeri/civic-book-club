'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.hasMany(models.Review, { foreignKey: 'BookId' })
      Book.hasMany(models.Event, { foreignKey: 'BookId' })
      Book.belongsToMany(models.User, {
        through: models.LikedBook,
        foreignKey: 'BookId',
        as: 'LikedBooks'
      })
    }
  }
  Book.init({
    name: DataTypes.STRING,
    ISBN: DataTypes.NUMBER,
    introduction: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
    underscored: true,
  });
  return Book;
};