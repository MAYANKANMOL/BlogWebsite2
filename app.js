require("dotenv").config();

const express = require("express");
const expresslayout = require("express-ejs-layouts");
const methodOveride = require('method-override');
const bodyparser = require("body-parser")
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const session = require('express-session');
const  connectDB = require("./server/config/db");
// const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOveride("_method"));
app.use(cookieParser());

const PORT = 3000 || process.env.PORT; //default port no Online

connectDB(); 
// mongoose.connect('mongodb://127.0.0.1:27017/blogDB');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));
app.use(express.static("public"));

app.use(expresslayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use('/', require("./server/routes/main"));
app.use('', require("./server/routes/admin"));


app.listen(PORT, function(){
    console.log(`server is listning on port ${PORT}`);
});