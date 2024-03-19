const cron = require("node-cron")
const blogModel = require("./Models/blogModel")


const cleanUpDeletedBlogs = () =>{
    cron.schedule("*/5 * * * * *",async()=>{
        // console.log("cron running")
        const deletedIds = []
        const deletedBlogs = await blogModel.find({isDeleted: true})
       if(deletedBlogs.length > 0){
        deletedBlogs.map((ele)=>{
            console.log(ele.deletionTime.getTime())
            const diff = ((Date.now() - ele.deletionTime.getTime())/(1000*60))
            console.log(diff)
            if(diff > 4){
                deletedIds.push(ele._id)
            }
            
        })
       }

       try{
            await blogModel.findOneAndDelete({
                _id:{$in: deletedIds}
            })
            console.log("id deleted");
        }
       catch(err){
        return err
       }
    })
}

module.exports = {cleanUpDeletedBlogs}