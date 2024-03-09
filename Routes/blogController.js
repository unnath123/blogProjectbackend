const express = require("express");
const blogRoute = express.Router();
const User = require("../class/userClass");
const { createBlog, getAllBlogs, getMyBlogs, getblogwidthID, deleteBlog } = require("../Functions/blogFuncs");
const blogModel = require("../Models/blogModel");
const { isAuth } = require("../Middlewares/isAuth");


blogRoute.post("/create-blog",  async(req,res)=>{
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
blogRoute.get("/all-blogs",  async(req, res)=>{
  
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
    //console.log(userID)

    const SKIP = Number(req.query.skip) || 0
    try{
        const myblogs = await getMyBlogs({SKIP, userID})

        if(myblogs.length === 0) {
            return res.send({
                status:400,
                message:"No blogs to display"
            })
        }

        return res.send({
            status:200,
            message:"blogs retrieved successfully",
            data: myblogs
        })
    }
    catch(err){
        return res.send({
            status:400,
            message:"no blogs found",
            error:err
        })
    } 
})

// To be done during frontend
//blogRoute.post("/edit-blog")

blogRoute.delete("/delete-blog", async(req,res)=>{
    const {blogID} = req.body;
    const userID = req.session.user.userId;

    if(!blogID || !userID){
        return res.send({
            status:400,
            message:"user or blog ID empty"
        })
    }

    try{
        const blog = await getblogwidthID(blogID)
        if(!blog.userId.equals(userID)){
            return res.send({
                status: 403,
                message: "Not allowed to delete, authorization failed.",
            })
        }

        const blogDeleted = await deleteBlog(blogID);

        return res.send({
            status:200,
            message: "successfully deleted"
        })

    }
    catch(err){
        return res.send({
            status:400,

        })
    }
      
})

module.exports = blogRoute