'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            userId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.DataTypes.INTEGER,
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            userName: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            phoneNumber: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            profileImg: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            token: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            likes: {
                type: Sequelize.DataTypes.INTEGER,
                defaultValue: 0,
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
        await queryInterface.dropTable('Users');
    },
};
