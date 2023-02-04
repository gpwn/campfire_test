'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Camps', {
            campId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.DataTypes.INTEGER,
            },
            hostId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Hosts',
                    key: 'hostId',
                },
                onDelete: 'cascade',
            },
            campName: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            campAddress: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            campMainImage: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            campSubImages: {
                type: Sequelize.DataTypes.STRING(2000),
                allowNull: true,
            },
            campDesc: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: false,
            },
            checkIn: {
                type: Sequelize.DataTypes.TIME,
                allowNull: false,
            },
            checkOut: {
                type: Sequelize.DataTypes.TIME,
                allowNull: false,
            },
            likes: {
                type: Sequelize.DataTypes.INTEGER,
                defaultValue: 0,
            },
            mapX: {
                type: Sequelize.DataTypes.STRING,
            },
            mapY: {
                type: Sequelize.DataTypes.STRING,
            },
            homepage: {
                type: Sequelize.DataTypes.STRING,
            },
            premium: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Camps');
    },
};
