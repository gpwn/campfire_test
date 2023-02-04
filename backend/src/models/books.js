'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Books extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Users, { foreignKey: 'userId' });
            this.belongsTo(models.Hosts, { foreignKey: 'hostId' });
            this.belongsTo(models.Camps, { foreignKey: 'campId' });
            this.belongsTo(models.Sites, { foreignKey: 'siteId' });
        }
    }
    Books.init(
        {
            bookId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'userId',
                },
                onDelete: 'cascade',
            },
            hostId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Hosts',
                    key: 'hostId',
                },
                onDelete: 'cascade',
            },
            campId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Camps',
                    key: 'campId',
                },
                onDelete: 'cascade',
            },
            siteId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Sites',
                    key: 'siteId',
                },
                onDelete: 'cascade',
            },
            checkInDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            checkOutDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            usingDays: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            adults: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            children: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            totalPeople: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            confirmBook: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            expiredBooks: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            cancelBooks: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: 'Books',
        }
    );
    return Books;
};
