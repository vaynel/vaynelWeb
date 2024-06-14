const express = require('express');
const router = express.Router();


router.get('/',(req,res)=>{
    console.log("good")
    res.json({'good':'good',"intTest":1})
})



module.exports = router;