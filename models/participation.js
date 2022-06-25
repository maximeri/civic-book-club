'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Participation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Participation.init({
    event_id: DataTypes.NUMBER,
    member_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Participation',
    underscored: true,
  });
  return Participation;
};