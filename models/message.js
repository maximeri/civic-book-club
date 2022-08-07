'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.User, { foreignKey: "UserId", as: "User" })
      Message.belongsTo(models.Room, { foreignKey: "RoomId", as: "Room" })
    }
  }
  Message.init({
    room_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Message',
    underscored: true,
  });
  return Message;
};