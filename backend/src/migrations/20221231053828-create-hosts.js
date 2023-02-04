'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Hosts', {
            hostId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.DataTypes.INTEGER,
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: true,
            },
            hostName: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            brandName: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: true,
            },
            companyNumber: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: true,
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            phoneNumber: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            profileImg: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            token: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
                unique: true,
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
        await queryInterface.dropTable('Hosts');
    },
};
