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
    ISBN: DataTypes.STRING,
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