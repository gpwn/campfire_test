'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Sites extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Hosts, { foreignKey: 'hostId' });
            this.belongsTo(models.Camps, { foreignKey: 'campId' });
            this.hasMany(models.Books, {
                as: 'Books',
                foreignKey: 'siteId',
            });
        }
    }
    Sites.init(
        {
            siteId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
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
            hostId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Hosts',
                    key: 'hostId',
                },
                onDelete: 'cascade',
            },
            siteName: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            siteInfo: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            siteDesc: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            sitePrice: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            siteMainImage: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            siteSubImages: {
                type: DataTypes.STRING(2000),
                allowNull: false,
            },
            minPeople: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            maxPeople: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            roomCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 3,
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
            modelName: 'Sites',
        }
    );
    return Sites;
};
