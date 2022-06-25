'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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