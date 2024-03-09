const accessModel = require("../Models/accessModel");

const ratelimit = async(req, res, next) =>{
    const sid = req.session.id;

    try{
        const accessdb = await accessModel.findOne({sessionId: sid});
        console.log("ratelimit")
        //if record mot present already create it
        if(!accessdb){
            const accessobj = new accessModel({
                sessionId: sid,
                time:Date.now()
            })
           await accessobj.save();
           next()
           return;
        }

        //if session already present
        const diff = Date.now() - accessdb.time

        // console.log(Date.now(), " ", accessdb.time);
        // console.log(diff)

        if(diff<5000){
            return res.send({
                status:400,
                message:"Too many requests please try after sometime"
            })
        }

        await accessModel.findOneAndUpdate({sessionId: sid}, {time:Date.now()})
        next();
    }
    catch(error){
        return res.send({
            status: 500,
            error: error,
          });
        }
}

module.exports = {ratelimit}