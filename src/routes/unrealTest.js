const express = require('express');
const router = express.Router();
const unrealController = require('../controllers/unrealController');


router.get('/test',(req,res)=>{
    console.log("good")
    res.json({'good':'good',"intTest":1})
})

router.get('/generate-data',unrealController.generateData)



module.exports = router;