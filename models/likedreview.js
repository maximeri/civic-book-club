'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LikedReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LikedReview.init({
    user_id: DataTypes.NUMBER,
    review_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'LikedReview',
    underscored: true,
  });
  return LikedReview;
};