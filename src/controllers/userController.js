const UserModel = require('../models/users');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { sendMail } = require('../config/mailSender'); 

exports.login = (req, res) => {
    res.render('main/login', { csrfToken: req.csrfToken() });
};

// 회원 추가 
exports.addUser = async (req, res) => {
    const { user_id, name, password, email, gender, birthday, zodiac, mbti, phone, age, department, position } = req.body;
    const profilePicPath = req.file ? req.file : 'images/profile-placeholder.png';

    try {
        // 비밀번호 유효성 검사: 최소 5자 길이 및 특수 문자 최소 2개
        const specialCharsCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;
        if (password.length < 5 || specialCharsCount < 2) {
            return res.status(400).json({ success: false, message: 'Password must be at least 5 characters long and contain at least 2 special characters.' });
        }

        // 중복된 사용자 ID 확인
        const existingUser = await UserModel.findOne({ where: { user_id: user_id } });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User ID already exists.' });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 8);
        // 고유 ID 생성
        const id = require('crypto').randomBytes(5).toString('hex');
        
        // 새로운 사용자 생성
        await UserModel.create({
            id: id,
            user_id: user_id,
            name: name,
            password: hashedPassword,
            email: email,
            gender: gender,
            birthday: birthday,
            zodiac: zodiac,
            mbti: mbti,
            phone: phone,
            age: age,
            department: department,
            position: position,
            profilePic: profilePicPath
        });

        res.status(201).json({ success: true, message: 'User added successfully.' });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ success: false, message: 'Failed to add user.' });
    }
};

exports.resetPassword = async (req, res) => {
    const userId = req.body.id;
    const user = await UserModel.findOne({ where: { user_id: userId } });
    if (!user) {
        return res.status(404).send('User not found.');
    }

    const temporaryPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 8);

    try {
        await UserModel.update({ password: hashedPassword }, { where: { user_id: userId } });
        await sendMail(user.email, 'Password Reset', `Your temporary password is: ${temporaryPassword}`);
        res.json({ success: true, message: 'Temporary password sent to your email.' });
    } catch (error) {
        console.error('Failed to reset password:', error);
        res.status(500).send('Error sending temporary password.');
    }
};

exports.initUsers = async (req, res) => {
    const users = [
        { user_id: 'user001', name: 'John Doe', password: 'password1', email: 'john.doe@example.com', department: '개발', position: '사원', gender: 'male', birthday: '1985-06-15', zodiac: 'gemini', mbti: 'INTJ', phone: '010-1111-1111' },
        { user_id: 'user002', name: 'Jane Smith', password: 'password2', email: 'jane.smith@example.com', department: '디자인', position: '대리', gender: 'female', birthday: '1990-07-22', zodiac: 'cancer', mbti: 'ENFP', phone: '010-2222-2222' },
        { user_id: 'user003', name: 'Alice Johnson', password: 'password3', email: 'alice.johnson@example.com', department: '인사', position: '과장', gender: 'female', birthday: '1982-08-03', zodiac: 'leo', mbti: 'INFJ', phone: '010-3333-3333' },
        { user_id: 'user004', name: 'Bob Brown', password: 'password4', email: 'bob.brown@example.com', department: '운영', position: '차장', gender: 'male', birthday: '1975-05-18', zodiac: 'taurus', mbti: 'ENTP', phone: '010-4444-4444' },
        { user_id: 'user005', name: 'Charlie Davis', password: 'password5', email: 'charlie.davis@example.com', department: '개발', position: '부장', gender: 'male', birthday: '1980-12-12', zodiac: 'sagittarius', mbti: 'ISTJ', phone: '010-5555-5555' },
        { user_id: 'user006', name: 'Daisy Evans', password: 'password6', email: 'daisy.evans@example.com', department: '디자인', position: '사원', gender: 'female', birthday: '1995-03-25', zodiac: 'aries', mbti: 'ISFP', phone: '010-6666-6666' },
        { user_id: 'user007', name: 'Edward Fox', password: 'password7', email: 'edward.fox@example.com', department: '인사', position: '대리', gender: 'male', birthday: '1988-01-30', zodiac: 'aquarius', mbti: 'ESTJ', phone: '010-7777-7777' },
        { user_id: 'user008', name: 'Grace Green', password: 'password8', email: 'grace.green@example.com', department: '운영', position: '과장', gender: 'female', birthday: '1983-09-09', zodiac: 'virgo', mbti: 'ESFJ', phone: '010-8888-8888' },
        { user_id: 'user009', name: 'Henry Hill', password: 'password9', email: 'henry.hill@example.com', department: '개발', position: '차장', gender: 'male', birthday: '1977-04-22', zodiac: 'taurus', mbti: 'INTP', phone: '010-9999-9999'},
        { user_id: 'user010', name: 'Ivy Johnson', password: 'password10', email: 'ivy.johnson@example.com', department: '디자인', position: '부장', gender: 'female', birthday: '1986-11-11', zodiac: 'scorpio', mbti: 'ENFJ', phone: '010-0000-0000' }
    ];

    try {
        for (let user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 8);
            user.password = hashedPassword;
            user.id = require('crypto').randomBytes(5).toString('hex');
            await UserModel.create(user);
        }
        res.status(201).json({ success: true, message: 'All users added successfully.' });
    } catch (error) {
        console.error('Error initializing users:', error);
        res.status(500).json({ success: false, message: 'Failed to add users.' });
    }
}