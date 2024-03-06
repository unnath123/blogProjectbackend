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
        if(!userdb) reject("blog couldnt be created");
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

const getAllBlogs = ({SKIP }) =>{
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
            if(!allBlogs) reject("No blogs found");

            resolve(allBlogs[0].data)
        }
        catch(err){
            reject("No blogs")
        }
    })
}










const newfunc = () =>{

}

module.exports = {createBlog, getAllBlogs}