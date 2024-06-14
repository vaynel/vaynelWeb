const express = require('express');
const http = require('http');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const csrf = require('csurf');

const app = express();
require('./src/config/passport-config')(passport);  // Passport 설정 가져오기
const userRoutes = require('./src/routes/userRoutes');
const boardRoutes = require('./src/routes/boardRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const restRoutes = require('./src/routes/restRoutes');
const openAiRoutes = require('./src/routes/openAIRoutes');
const unrealRoutes = require('./src/routes/unrealTest');

const sequelize = require('./src/config/dbSequelize');
const port = 3000;



const socketConfig = require('./src/config/socketConfig');  // Socket.IO 설정 가져오기

//app.use(helmet())
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf());
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.set('view engine', 'pug');
app.set('views', './src/views');

app.use('/', userRoutes);

app.use('/board',boardRoutes );
app.use('/chat', chatRoutes);
app.use('/rest',restRoutes);
app.use('/ai',openAiRoutes);
app.use('/unreal',unrealRoutes);

const server = http.createServer(app);
socketConfig(server);  // Socket.IO 설정 적용




// server.listen(3000, () => {
//     console.log('Listening on *:3000');
// });


sequelize.sync() // 모델에 따라 데이터베이스 테이블을 생성합니다.
    .then(() => {
        console.log('Database & tables created!');
        server.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });