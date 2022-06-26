'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friendship extends Model {
    static associate(models) {
    }
  }
  Friendship.init({
    status: DataTypes.STRING,
    receiver_id: DataTypes.NUMBER,
    requester_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Friendship',
    tableName: 'Friendships',
    underscored: true,
  });
  return Friendship;
};