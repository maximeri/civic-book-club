'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Participation extends Model {
    static associate(models) {
      Participation.belongsTo(models.Event, { foreignKey: 'eventId' })
    }
  }
  Participation.init({
    event_id: DataTypes.INTEGER,
    member_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Participation', 
    tableName: 'Participations',
    underscored: true,
  });
  return Participation;
};