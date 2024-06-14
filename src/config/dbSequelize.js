const Sequelize = require('sequelize');

// 환경변수 사용을 위해 dotenv 라이브러리 사용 (선택적)
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,      // 환경 변수에서 데이터베이스 이름을 가져옴
    process.env.DB_USER,      // 환경 변수에서 데이터베이스 사용자 이름을 가져옴
    process.env.DB_PASSWORD,  // 환경 변수에서 데이터베이스 비밀번호를 가져옴
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // 로깅 비활성화 (콘솔에 SQL 로그를 출력하지 않음)
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


module.exports = sequelize;
