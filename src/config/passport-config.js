const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const User = require('../models/users'); // Sequelize 모델 가져오기

module.exports = function(passport) {
    // 로컬 전략
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password'
    }, async (id, password, done) => {
        try {
            const user = await User.findOne({ where: { user_id: id } });
            if (!user) {
                return done(null, false, { message: 'Incorrect userId.' });
            }
            
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        } catch (err) {
            return done(err);
        }
    }));

    // JWT 전략
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'your_jwt_secret'
    }, async (jwt_payload, done) => {
        try {
            const user = await User.findByPk(jwt_payload.id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));

    // 세션에 사용자 정보 저장
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // 세션에서 사용자 정보 복원
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return done(new Error('No user with that id'));
            }
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
