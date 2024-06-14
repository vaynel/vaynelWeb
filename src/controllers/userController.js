const UserModel = require('../models/users');
const bcrypt = require('bcryptjs');
const { sendMail } = require('../config/mailSender'); 

exports.login = (req, res) => {
    res.render('main/login', { csrfToken: req.csrfToken() });
};


exports.addUser = async (req, res) => {
    const { user_id, name, password, email, department, position } = req.body;

    try {
        const specialCharsCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;
        if (password.length < 5 || specialCharsCount < 2) {
            return res.status(400).json({ success: false, message: 'Password must be at least 5 characters long and contain at least 2 special characters.' });
        }

        const existingUser = await UserModel.findOne({ where: { user_id: user_id } });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User ID already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        const id = require('crypto').randomBytes(5).toString('hex');
        await UserModel.create({
            id: id,
            user_id: user_id,
            name: name,
            password: hashedPassword,
            email: email,
            department: department,
            position: position
        });
        res.status(201).json({ success: true, message: 'User added successfully.' });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ success: false, message: 'Failed to add users.' });
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
        { user_id: 'user001', name: 'John Doe', password: 'password1', email: 'john.doe@example.com', department: '개발', position: '사원' },
        { user_id: 'user002', name: 'Jane Smith', password: 'password2', email: 'jane.smith@example.com', department: '디자인', position: '대리' },
        { user_id: 'user003', name: 'Alice Johnson', password: 'password3', email: 'alice.johnson@example.com', department: '인사', position: '과장' },
        { user_id: 'user004', name: 'Bob Brown', password: 'password4', email: 'bob.brown@example.com', department: '운영', position: '차장' },
        { user_id: 'user005', name: 'Charlie Davis', password: 'password5', email: 'charlie.davis@example.com', department: '개발', position: '부장' },
        { user_id: 'user006', name: 'Daisy Evans', password: 'password6', email: 'daisy.evans@example.com', department: '디자인', position: '사원' },
        { user_id: 'user007', name: 'Edward Fox', password: 'password7', email: 'edward.fox@example.com', department: '인사', position: '대리' },
        { user_id: 'user008', name: 'Grace Green', password: 'password8', email: 'grace.green@example.com', department: '운영', position: '과장' },
        { user_id: 'user009', name: 'Henry Hill', password: 'password9', email: 'henry.hill@example.com', department: '개발', position: '차장' },
        { user_id: 'user010', name: 'Ivy Johnson', password: 'password10', email: 'ivy.johnson@example.com', department: '디자인', position: '부장' }
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