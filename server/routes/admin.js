const express = require("express");
const router = express.Router();
const Post = require('../models/Post');
const user = require('../models/User');
const alert = require("alert");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const adminLayout = "../views/layouts/admin";

const authenticationMiddleware = function(req, res, next ) {
  const token = req.cookies.token;

  if(!token) {
    res.redirect("/");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch(error) {
    res.status(401).json( { message: 'Unauthorized'} );
  }
}
//admin login page
router.get('/admin', async function(req, res){
    try{
        const locals = {
            title: "Admin",
            discription: "Simple Blog Created with NodeJs, Express & MongoDB."
        }
        res.render("admin/index", {
            locals: locals,
            layout: adminLayout
        })
    }catch(error){
        console.log(error);
    }
});

router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
  
    const userperson = await user.findOne( { username } );
    
    if(!userperson) {
      return res.status(401).json( { message: 'Invalid' } );
      // return alert("Invalid");
    }

    const isPasswordValid = await bcrypt.compare(password, userperson.password);

    if(!isPasswordValid || userperson._id != "64c3f3e021bbe8af2d831809") {
      return res.status(401).json( { message: 'Invalid' } );
    }

    const token = jwt.sign({ userId: userperson._id}, jwtSecret);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');

  } catch (error) {
    console.log(error);
  }
});

//dashboard
router.get('/dashboard', authenticationMiddleware, async function(req, res){

  try{
    const locals = {
        title: "DashBoard",
        discription: "Simple Blog Created with NodeJs, Express & MongoDB."
    }
    let post = await Post.find();
    post = await Post.aggregate([{$sort: { createdAt: -1}}]).exec();
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, 'MySecretBlog');
    const userId = decodedToken.userId;
    if(userId != "64c3f3e021bbe8af2d831809"){
      res.redirect('/userdashboard');
    }else{
      res.redirect('/dashboard');
    }
    res.render("admin/dashboard", {
        locals: locals,
        data : post,
        layout: adminLayout
    })
  }catch(error){
    console.log(error);
  }
});
// get createpost
router.get('/createPost', authenticationMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'CreatePost',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }
    
    const data = await Post.find();
    res.render('admin/createPost', {
      locals: locals,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }
});
//post createblog
router.post('/createPost', authenticationMiddleware, async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const decodedToken = jwt.verify(token, 'MySecretBlog');
      const userId = decodedToken.userId;
      try {
        const newPost = await Post.create(({ title: req.body.title, body: req.body.body, user_id: userId}));
        if(userId === "64c3f3e021bbe8af2d831809"){
          res.redirect('/dashboard');
        }else{
          res.redirect('/userdashboard');
        }
      } catch (error) {
        console.log(error);
      }
      
    } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.log(error);
  }
});

//get edit
router.get('/edit-post/:id', authenticationMiddleware, async (req, res) => {
  try {

    const locals = {
      title: "Edit Post",
      description: "Free NodeJs User Management System",
    };

    const data = await Post.findOne({ _id: req.params.id });

    res.render('admin/EditPost', {
      locals,
      data,
      layout: adminLayout
    })

  } catch (error) {
    console.log(error);
  }
});

// put create post
router.put('/edit-post/:id', authenticationMiddleware, async (req, res) => {
  try {

    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    });
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, 'MySecretBlog');
    const userId = decodedToken.userId;
    if(userId === "64c3f3e021bbe8af2d831809"){
      res.redirect('/dashboard');
    }else{
      res.redirect('/userdashboard');
    }

  } catch (error) {
    console.log(error);
  }

});
//delete post
router.delete('/delete-post/:id', authenticationMiddleware, async (req, res) => {
  try {

    await Post.deleteOne( {_id: req.params.id} );

    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, 'MySecretBlog');
    const userId = decodedToken.userId;
    if(userId === "64c3f3e021bbe8af2d831809"){
      res.redirect('/dashboard');
    }else{
      res.redirect('/userdashboard');
    }

  } catch (error) {
    console.log(error);
  }

});
router.get('/logout', function(req, res){
  res.clearCookie("token");
  res.redirect("/");
});

//////////////////////Users///////////////////////
//login page

router.get('/userlogin', async function(req, res){
  try{
      const locals = {
          title: "Admin",
          discription: "Simple Blog Created with NodeJs, Express & MongoDB."
      }
      res.render("usersperson/index", {
          locals: locals,
          layout: adminLayout
      })
  }catch(error){
      console.log(error);
  }
});
router.post('/userlogin', async (req, res) => {
try {
  const { username, password } = req.body;
  
  const userperson = await user.findOne( { username } );

  if(!userperson) {
    return res.status(401).json( { message: 'Invalid' } );
    // return alert("Invalid");
  }

  const isPasswordValid = await bcrypt.compare(password, userperson.password);

  if(!isPasswordValid) {
    return res.status(401).json( { message: 'Invalid' } );
  }

  const token = jwt.sign({ userId: userperson._id}, jwtSecret);
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/userdashboard');

} catch (error) {
  console.log(error);
}
});

router.get('/userdashboard', authenticationMiddleware, async function(req, res){
  try{
    const locals = {
        title: "DashBoard",
        discription: "Simple Blog Created with NodeJs, Express & MongoDB."
    }
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const decodedToken = jwt.verify(token, 'MySecretBlog');
      const userId = decodedToken.userId;
      let post = await Post.find({user_id: userId});
      const name = await user.findOne({ _id: userId });    
      res.render("usersperson/userdashboard", {
        locals: locals,
        data : post,
        username: name.username,
        layout: adminLayout
      });
      
    } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
    }
    
  }catch(error){
    console.log(error);
  }
  
});


router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        const userperson = await user.create({ username: username, password: hashedPassword });
        res.status(201).json({ message: 'User Created', userperson });
      } catch (error) {
        if(error.code === 11000) {
          res.status(409).json({ message: 'User already in use'});
        }
        res.status(500).json({ message: 'Internal server error'})
      }
  
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;
