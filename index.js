const express = require("express");
require("dotenv").config();
const session = require("express-session")
const mongoDBsession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose")
const authRoute = require("./Routes/authController")
const blogRoute = require("./Routes/blogController")
const followRoute = require("./Routes/followController");
const db = require('./db');
const { isAuth } = require("./Middlewares/isAuth");
const { cleanUpDeletedBlogs } = require("./cron");
const cors = require('cors');

const app = express();
const URI = "mongodb+srv://unnath:12345@cluster0.djsaywi.mongodb.net/blog_project"

const store = new mongoDBsession({
    uri: URI,
    collection: "sessions"
})


app.use(express.json());
app.use(session({
    secret:"Todo appplication nodejs",
    saveUninitialized: false,
    resave: false,
    store:store,
    cookie: {
      domain: 'blogui-chi.vercel.app',
      path:"/",
      maxAge: 1000*60*60*24*2,
      secure: true,
      sameSite: 'none',
    },
}))

// app.use(
//   cors({
//     origin: "*",
//     methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
//     credentials: true,
//   })
// );
const corsOptions = {
  origin: 'https://blogui-chi.vercel.app',
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true
};

app.use(cors(corsOptions));

app.use("/auth", authRoute);
app.use("/blog", isAuth, blogRoute);
app.use("/follow", isAuth, followRoute);

app.get("/", (req, res)=>{
    return res.send("home page")
})

app.listen("8000", ()=>{
    console.log("server started")
    //cleanUpDeletedBlogs()
    // console.log("end")
})
