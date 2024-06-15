const express = require('express');
const passport = require('passport')

const router = express.Router();
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');

router.get('/', userController.login);

router.get('/login', userController.login);


router.get('/main', (req, res) => {
    res.render('main/main', { title: '회원가입', csrfToken: req.csrfToken() });
});


router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: "Access to protected data successful", data: req.user });
});


router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Authentication failed due to server error.' });
        }
        if (!user) {
            return res.status(401).json({ success: false, message: info.message });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({ success: false, message: 'Login failed during session creation.' });
            }
            const token = jwt.sign({ id: req.user.id }, 'your_jwt_secret', { expiresIn: '1d' });
            return res.json({ success: true, message: 'Login successful.',token }); // 성공 응답
        });
    })(req, res, next);
});

// 로그아웃
router.post('/logout', (req, res) => {
    req.logout(function(err) {  // 로그아웃 처리에 콜백 함수 추가
        if (err) { return next(err); }  // 오류 처리
        req.session.destroy(() => {  // 세션 파괴
            res.clearCookie('connect.sid', { path: '/' });  // 쿠키 삭제, 쿠키 경로 명시 필요
            res.json({ success: true, message: 'Logged out successfully' });  // 클라이언트에 성공 응답 전송
        });
    });
});

router.get('/signup', (req, res) => {
    res.render('main/signup', { title: '회원가입', csrfToken: req.csrfToken() });
});

router.post('/signup', userController.addUser)

router.get('/jwtTest', (req, res) => {
    res.render('users/jwtTest', { title: '회원가입', csrfToken: req.csrfToken() });
});

// 현재 로그인된 사용자 정보를 반환하는 라우트
router.get('/current-user', (req, res) => {
    if (req.isAuthenticated()) { // 사용자가 인증된 경우
        res.json({ success: true, user: req.user }); // 사용자 정보 전달
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' }); // 인증되지 않은 경우
    }
});

router.post('/reset-password', userController.resetPassword);


router.get('/init-users', userController.initUsers);

module.exports = router;
