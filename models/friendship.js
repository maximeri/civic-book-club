'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friendship extends Model {
    static associate(models) {
      Friendship.belongsTo(models.User, { foreignKey: 'receiverId' })
      Friendship.belongsTo(models.User, { foreignKey: 'requesterId' })
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