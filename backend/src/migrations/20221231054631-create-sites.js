'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Sites', {
            siteId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.DataTypes.INTEGER,
            },
            campId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Camps',
                    key: 'campId',
                },
                onDelete: 'cascade',
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
            siteName: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            siteInfo: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: false,
            },
            siteDesc: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: false,
            },
            sitePrice: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            siteMainImage: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            siteSubImages: {
                type: Sequelize.DataTypes.STRING(2000),
                allowNull: false,
            },
            minPeople: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            maxPeople: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            roomCount: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 3,
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
        await queryInterface.dropTable('Sites');
    },
};
