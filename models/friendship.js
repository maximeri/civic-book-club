'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friendship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Friendship.init({
    status: DataTypes.STRING,
    receiver_id: DataTypes.NUMBER,
    requester_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Friendship',
    underscored: true,
  });
  return Friendship;
};