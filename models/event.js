'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.User, {foreignKey: 'HostId'})
      Event.belongsTo(models.Book, { foreignKey: 'BookId'})
      Event.belongsToMany(models.User, { through: models.Participation ,foreignKey: 'EventId' })
    }
  }
  Event.init({
    topic: DataTypes.STRING,
    startAt: DataTypes.DATE,
    endAt: DataTypes.DATE,
    memberCount: DataTypes.INTEGER,
    meetingLink: DataTypes.STRING,
    isPublished: DataTypes.BOOLEAN,
    isPrivate: DataTypes.BOOLEAN,
    currentMemberCount: DataTypes.INTEGER,
    hostId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'Event',
    underscored: true,
  });
  return Event;
};