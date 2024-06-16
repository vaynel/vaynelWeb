// controllers/boardController.js
const Board = require('../models/board');
const User = require('../models/users');
const multer = require('multer');

// 파일 업로드 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// 게시글 생성
exports.createBoard = async (req, res) => {
    try {
        const { title, content } = req.body;
        await Board.create({ title, content });
        res.status(201).json({ success: true, message: 'Board created successfully.' });
    } catch (error) {
        console.error('Error creating board:', error);
        res.status(500).json({ success: false, message: 'Failed to create board.' });
    }
};

// 게시글 생성
exports.newBoard = async (req, res) => {
    res.render('boards/newBoard', { csrfToken: req.csrfToken() });
};

// 게시글 조회 
exports.getBoards = async (req, res) => {
    try {
        const boards = await Board.findAll();
        const user = await User.findByPk(req.user.id); // 로그인한 사용자 정보 가져오기
        res.render('boards/boards', { title: '게시판', boards, user });
    } catch (error) {
        console.error('Error fetching boards:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch boards.' });
    }
};


// 게시글 조회
exports.getBoard = async (req, res) => {
    try {
        const board = await Board.findByPk(req.params.id);
        if (!board) {
            return res.status(404).json({ success: false, message: 'Board not found.' });
        }
        res.render('boards/boardDetail', { title: '게시글 상세', board });
    } catch (error) {
        console.error('Error fetching board:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch board.' });
    }
};

// 게시글 수정
exports.updateBoard = async (req, res) => {
    try {
        const { title, content } = req.body;
        const board = await Board.findByPk(req.params.id);
        if (!board) {
            return res.status(404).json({ success: false, message: 'Board not found.' });
        }
        await board.update({ title, content });
        res.json({ success: true, message: 'Board updated successfully.' });
    } catch (error) {
        console.error('Error updating board:', error);
        res.status(500).json({ success: false, message: 'Failed to update board.' });
    }
};

// 게시글 삭제
exports.deleteBoard = async (req, res) => {
    try {
        const board = await Board.findByPk(req.params.id);
        if (!board) {
            return res.status(404).json({ success: false, message: 'Board not found.' });
        }
        await board.destroy();
        res.json({ success: true, message: 'Board deleted successfully.' });
    } catch (error) {
        console.error('Error deleting board:', error);
        res.status(500).json({ success: false, message: 'Failed to delete board.' });
    }
};

exports.upload = upload;
