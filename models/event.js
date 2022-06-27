'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.hasMany(models.User, { foreignKey: 'HostId' })
      Event.hasMany(models.Book, { foreignKey: 'BookId' })
      Event.belongsToMany(models.User, { through: models.Participation, foreignKey: 'EventId' })
    }
  }
  Event.init({
    topic: DataTypes.STRING,
    start_at: DataTypes.DATE,
    end_at: DataTypes.DATE,
    memberCount: DataTypes.NUMBER,
    meetingLink: DataTypes.STRING,
    isPublished: DataTypes.BOOLEAN,
    isPrivate: DataTypes.BOOLEAN,
    host_id: DataTypes.NUMBER,
    book_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Event',
    underscored: true,
  });
  return Event;
};