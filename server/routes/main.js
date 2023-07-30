const express = require("express");
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const mainLayout = "../views/layouts/main";

//routes
router.get('', async function(req, res){
    try{
        const locals = {
            title: "BlogWebsite",
            discription: "Simple Blog Created with NodeJs, Express & MongoDB."
        }

        const data = await Post.aggregate([{$sort: { createdAt: -1}}]).exec();

        res.render("index", {
            locals: locals,
            data: data,
            layout: mainLayout
        })
    }catch(error){
        console.log(error);
    }
});

router.get('/post/:id', async function(req, res){
    try{
        let ide = req.params.id;
        const data = await Post.findById({_id: ide});
        const userid = data.user_id;
        const usertemp = await User.findById({_id: userid});
        const name = usertemp.username;
        console.log(name);
        const locals = {
            title: data.title,
            discription: "Simple Blog Created with NodeJs, Express & MongoDB."
        }
        res.render("post", {
            locals: locals,
            data: data,
            name: name
        })
    }catch(error){
        console.log(error);
    }
});

router.post('/search', async function(req, res){
    try{
        const locals = {
            title: "Search",
            discription: "Simple Blog Created with NodeJs, Express & MongoDB."
        }
        let searchname = req.body.searchname;
        const no_special_character_search = searchname.replace(/[^a-zA-Z0-9 ]/g, "");
        const data = await Post.find({
            $or: [
                {title: {$regex: no_special_character_search, $options: "i"}},
                {body: {$regex: no_special_character_search, $options: "i"}}
            ]
        })
        res.render("searchmain", {
            locals: locals,
            data: data
        })
    }catch(error){
        console.log(error);
    }
});

router.get('/about', function(req, res){
    res.render("about");
});

router.get('/contact', function(req, res){
    const locals = {
        title: "contact",
        discription: "Simple Blog Created with NodeJs, Express & MongoDB."
    }
    res.render("contact",{
        locals: locals,
        layout: mainLayout
    });
});



module.exports = router;















// function insertPosts(){
//     Post.insertMany([
//         {
//             title: "x3",
//             body: "body of post1"
//         }
//     ]);
// }
// insertPosts();