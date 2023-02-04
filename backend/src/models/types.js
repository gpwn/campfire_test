'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Types extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Camps, { foreignKey: 'campId' });
            this.hasMany(models.Likes, {
                as: 'Likes',
                foreignKey: 'campId',
            });
        }
    }
    Types.init(
        {
            typeId: {
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
            typeLists: {
                type: DataTypes.STRING,
                allowNull: true,
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
            modelName: 'Types',
        }
    );
    return Types;
};
