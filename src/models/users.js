const Sequelize = require('sequelize');
const sequelize = require('../config/dbSequelize');

const User = sequelize.define('User', {
    id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
    },
    name: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    department: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    position: {
        type: Sequelize.STRING(255)
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'users',
    timestamps: true
});

module.exports = User;