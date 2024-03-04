const express = require("express");
const { isAuth } = require("../authMiddleware/isAuth");
const blogRoute = express.Router();


blogRoute.post("/create-blog", isAuth,  (req,res)=>{
    
})

module.exports = blogRoute