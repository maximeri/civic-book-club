'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LikedBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LikedBook.init({
    book_id: DataTypes.NUMBER,
    user_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'LikedBook',
    tableName: 'LikedBooks',
    underscored: true,
  });
  return LikedBook;
};