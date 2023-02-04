'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Books, {
                as: 'Books',
                foreignKey: 'userId',
            });
            this.hasMany(models.Likes, {
                as: 'Likes',
                foreignKey: 'userId',
            });
            this.hasMany(models.Reviews, {
                as: 'Reviews',
                foreignKey: 'userId',
            });
        }
    }
    Users.init(
        {
            userId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            userName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            profileImg: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            likes: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            provider: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            snsId: {
                allowNull: true,
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: 'Users',
        }
    );
    return Users;
};
