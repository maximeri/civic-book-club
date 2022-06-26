'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Review, { foreignKey: 'UserId' })
      User.hasMany(models.Event, { foreignKey: 'HostId' })
      User.hasMany(models.Friendship, { foreignKey: 'ReceiverId' })
      User.hasMany(models.Friendship, { foreignKey: 'RequesterId' })
      User.belongsToMany(models.Review, { through: models.LikedReview, foreignKey: 'UserId', as: 'LikedReviews' })
      User.belongsToMany(models.Book, { through: models.LikedBook, foreignKey: 'UserId', as: 'LikedBooks' })
      User.belongsToMany(User, { through: models.Friendship, foreignKey: 'ReceiverId', as: 'Requesters' })
      User.belongsToMany(User, { through: models.Friendship, foreignKey: 'RequesterId', as: 'Receivers' })
      User.belongsToMany(models.Event, { through: models.Participation, foreignKey: 'MemberId' })
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