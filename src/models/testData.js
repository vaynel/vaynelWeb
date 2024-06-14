const Sequelize = require('sequelize');
const sequelize = require('../config/dbSequelize')

const TestData = sequelize.define('TestData', {
    id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    prod_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
    },
    prod_name: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    image: {
        type: Sequelize.STRING(255)
    },
    info: {
        type: Sequelize.TEXT
    }
}, {
    tableName: 'test_data',
    timestamps: false
});

module.exports = TestData;