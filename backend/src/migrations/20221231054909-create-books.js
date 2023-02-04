'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Books', {
            bookId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.DataTypes.INTEGER,
            },
            userId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'userId',
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
            campId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Camps',
                    key: 'campId',
                },
                onDelete: 'cascade',
            },
            siteId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Sites',
                    key: 'siteId',
                },
                onDelete: 'cascade',
            },
            checkInDate: {
                type: Sequelize.DataTypes.DATEONLY,
                allowNull: false,
            },
            checkOutDate: {
                type: Sequelize.DataTypes.DATEONLY,
                allowNull: false,
            },
            usingDays: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
            },
            adults: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            children: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            totalPeople: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            confirmBook: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            expiredBooks: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false,
            },
            cancelBooks: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false,
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
        await queryInterface.dropTable('Books');
    },
};
