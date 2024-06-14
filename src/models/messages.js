const Sequelize = require('sequelize');
const sequelize = require('../config/dbSequelize')

// 모델 정의
const Message = sequelize.define('message', {
    content: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sender: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// 데이터베이스와 동기화
sequelize.sync();