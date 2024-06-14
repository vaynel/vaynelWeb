const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');


// router.get('/',(req,res)=>{
//     res.render('boards/boards', { title: '게시판' });
// })



// 게시글 생성
router.post('/', boardController.upload.single('file'), boardController.createBoard);

// 게시글 목록 조회
router.get('/', boardController.getBoards);

// 게시글 조회
router.get('/:id', boardController.getBoard);

// 게시글 수정
router.put('/:id', boardController.updateBoard);

// 게시글 삭제
router.delete('/:id', boardController.deleteBoard);
module.exports = router;