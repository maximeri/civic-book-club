'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.belongsTo(models.User, { foreignKey: "User1Id", as: "User1" })
      Room.belongsTo(models.User, { foreignKey: "User2Id", as: "User2" })
      Room.hasMany(models.Message, { foreignKey: "RoomId", as: "Messages" })
    }
  }
  room.init({
    User1Id: DataTypes.INTEGER,
    User2Id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'room',
    underscored: true,
  });
  return room;
};