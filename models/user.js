'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Review, { foreignKey: 'userId' })
      User.hasMany(models.Event, { foreignKey: 'hostId' })
      User.belongsToMany(models.Review, { through: models.LikedReview, foreignKey: 'userId', as: 'LikedReviews' })
      User.belongsToMany(models.Book, { through: models.LikedBook, foreignKey: 'userId', as: 'LikedBooks' })
      User.belongsToMany(User, { through: models.Friendship, foreignKey: 'receiverId', as: 'Requesters' })
      User.belongsToMany(User, { through: models.Friendship, foreignKey: 'requesterId', as: 'Receivers' })
      User.belongsToMany(models.Event, { through: models.Participation, foreignKey: 'memberId', as: 'ParticipatedEvents' })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    account: DataTypes.STRING,
    preference: DataTypes.STRING,
    job: DataTypes.STRING,
    goal: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  });
  return User;
};