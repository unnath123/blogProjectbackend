const blogModel = require("../Models/blogModel")

const createBlog = ({title, blog, creationTime, userID}) => {
    return new Promise((resolve, reject)=>{
    try{
        const blogObj = new blogModel({
            title,
            textBody: blog,
            creationDateTime: creationTime,
            userId: userID
        })
        const userdb = blogObj.save();
        if(!userdb)return reject("blog couldnt be created");
        resolve(userdb)
    }
    catch(err){
        return({
            status:400,
            message:err
        })
    }

    })
}

const getAllBlogs = ({SKIP}) =>{
    const LIMIT = 5;
    return new Promise( async(resolve, reject)=>{
        try{
            const allBlogs = await blogModel.aggregate([
                {
                    $sort:{creationDateTime: -1}
                },
                {
                    $facet:{
                        data:[{$skip:SKIP},{$limit: LIMIT}]
                    }
                }
            ])
            if(!allBlogs)return reject("No blogs found");

            resolve(allBlogs[0].data)
        }
        catch(err){
            reject("No blogs")
        }
    })
}

const getMyBlogs = ({SKIP, userID}) =>{
    const LIMIT = 5;
    return new Promise(async(resolve, reject)=>{
        try{
            const myBlogs = await blogModel.aggregate([
                {
                    $match: { userId: userID },
                  },
                  {
                    $sort: { creationDateTime: -1 },
                  },
                  {
                    $facet: {
                      data: [{ $skip: SKIP }, { $limit: LIMIT }]
                    },
                  },
            ])
            // console.log(myBlogs)
            resolve(myBlogs[0].data)
        }
        catch(err){
            reject("something went wrong")
        }
    })
}

const getblogwidthID = (blogID) =>{
    return new Promise(async(resolve, reject)=>{
        try{
            const blog =  await blogModel.findOne({_id: blogID});
            if(!blog)return reject("no blog with this blogID found")

            resolve(blog)
        }
        catch(err){
            reject("not blogs found")
        }
    })
}

const deleteBlog = (blogID) =>{
    return new Promise( async(resolve, reject)=>{

        try{
            const isDeleted = await blogModel.findOneAndDelete({_id:blogID})
            if(!isDeleted)reject("blog couldnt be deleted")

            resolve("blog successfully deleted")
        }   
        catch(err){
            reject("error deleting the blog")
        }
    })
}

module.exports = {createBlog, getAllBlogs, getMyBlogs, getblogwidthID, deleteBlog}


