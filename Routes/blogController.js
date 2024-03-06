const express = require("express");
const { isAuth } = require("../authMiddleware/isAuth");
const blogRoute = express.Router();
const User = require("../class/userClass");
const { createBlog, getAllBlogs } = require("../Functions/blogFuncs");
const blogModel = require("../Models/blogModel");



blogRoute.post("/create-blog", isAuth,  async(req,res)=>{
    const {title, blog} = req.body;
    const userID = req.session.user.userId;
    const creationTime = Date.now();

    if(!title || !blog){
        return res.send({
            message:"title or blog is empty",
            status:400
        })
    }

    try{
        await User.findUserwithLoginID({userID})
    }
    catch(err){
        return res.send({
            message:err,
            status:400
        })
    }

    //create-blog
    try{
        await createBlog({title, blog, creationTime, userID})
        // return res.send({
        //     status:201,
        //     message:"blog created"
        // })
    }
    catch(err){
        return res.send({
            status:400,
            message:"couldnot create blog"
        })
    }

    return res.send({
        status:201,
        message:"blog created"
    })

})

//getallblogs?skip=5 
blogRoute.get("/all-blogs", async(req, res)=>{
  
    const SKIP = Number(req.query.skip) || 0
    try{
        const allBlogs = await getAllBlogs({SKIP});
        if(allBlogs.length == 0){
            return res.send({
                status:400,
                message:"No blogs to display"
            })
        }

        return res.send({
            status:200,
            message:"success",
            data:allBlogs
        })
    }
    catch(err){
        return res.send({
            status:400,
            message:"could not find blogs"
        })
    }
})

blogRoute.get("/myblogs", async(req, res)=>{
    const userID = req.session.user.userId;
    const SKIP = Number(req.query.skip) || 0
    
    const myblogs = await getMyBlogs({SKIP, userID})
})

module.exports = blogRoute