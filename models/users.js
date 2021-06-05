'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Comments, {
        foreignKey: 'userId',
        onDelete: 'cascade',
      });

      this.hasMany(models.LikeOrDislike, {
        foreignKey: 'userId',
        onDelete: 'cascade',
      });
    }
  };
  Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    nickname: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};