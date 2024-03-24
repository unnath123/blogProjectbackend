const express = require("express");
const authRoute = express.Router();
const {validateRegistrationData} = require("../Functions/AuthFuncs");
const User = require("../class/userClass")
const bcrypt = require("bcrypt");
const { isAuth } = require("../Middlewares/isAuth");


authRoute.post("/register", async (req, res)=>{
    const {name, username, email, password} = req.body;
    // console.log(req.body);

    try{
        await validateRegistrationData({name, username, email, password})
    }
    catch(err){
        return res.send({
            status:400,
            message: "user data error",
            error:err
        })
    }

    try{
            await User.userNameandEmailExist({ email, username });
            const obj = new User({ email, name, username, password });
            const userDb = await obj.register();
            return res.send({
            status: 201,
            message: "Registration successfull",
            data: userDb,
            });
    }   
    catch(err){
        return res.send({
            status:400,
            message: "username exist"
        })
    }

})

authRoute.post("/login", async(req, res)=>{
    const {loginID, password} = req.body;
    // const loginID = "test1";
    // const password = "123"
    // //console.log("request body",req.body)
    // console.log("1")

    if(!loginID || !password){
        return res.send({
            message:"login ID or password is empty",
            status:400
        })
    }

    try{
        const userdb = await User.findUserwithLoginID({loginID})

        //console.log(userdb)
        const passwordMatched = await bcrypt.compare(password, userdb.password)
        // console.log(passwordMatched)

        if(!passwordMatched){
            return res.send({
                message:"password do not match",
                status:400
            })
        }
        req.session.isAuth = true
        req.session.user = {
            userId: userdb._id,
            username: userdb.username,
            email:userdb.email
        }

          return res.send({
            message: "login successfull"
          })
    }
    catch(err){
        return res.send({
            message:err,
            status:400
        })
    }
})

authRoute.post("/logout", isAuth, (req, res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.send({
                status:500,
                message: "couldnt logout",
                message:err
            })
        }
        else{
            return res.send({
                status:200,
                message: "logout successful"
            })
        }
    })
})

module.exports = authRoute 