const express = require('express');
const router = express.Router();
const userModel = require('../models/users');  // Ensure the correct path
const postModel = require('../models/posts');  // Ensure the correct path
const passport=require("passport");
const upload=require('./multer')
const localStrategy=require("passport-local");
const { route } = require('../app');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('feed.ejs');
});

// router.get('/createUser', async function(req, res, next) {  // Corrected `routes.get` to `router.get`
//   try {
//     let createdUser = await userModel.create({
//       username: "varun25",
//       password: "1234",
//       email: "varuncares22@gmail.com",
//       posts: [],
//       full_name: "Varun Sharma"
//     });
//     res.send(createdUser);
//   } catch (err) {
//     next(err);
//   }
// });

// router.get('/createPost',async function(req,res,next)
// {
//   try{
//     let createdPost=await postModel.create({
//       post_text:"This is my second post",
//       user:'6650226a1f2decf305572be3',
//     });

//     let user=await userModel.findOne({_id:"6650226a1f2decf305572be3"});
//     user.posts.push(createdPost._id);
//     await user.save();
//     res.send(createdPost);
//   }
//   catch(err){
//     next(err);
//   }

// });

// router.get("/allUserPosts",async function(req,res,next){
//   let user=await userModel.findOne({_id:"6650226a1f2decf305572be3"}).populate('posts');
//   res.send(user);
// })

router.get('/login',(req,res)=>{
  // console.log(req.flash('error'));
  res.render('login.ejs',{error:req.flash('error')});
})

router.get('/register',(req,res)=>{
  res.render('register.ejs');
})

router.get('/feed',function(req,res,next){
  res.render('feed');
})

router.post('/upload',isLoggedIn,upload.single("file"),async function(req,res,next){
  if(!req.file){
    return res.status(404).send("no files were given");
  }
  const user=await userModel.findOne({username:req.session.passport.user});
  const post=await postModel.create({
    image:req.file.filename,
    post_text:req.body.filecaption,
    user:user._id,
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
})

router.post('/register', function(req, res) {
  const {username, email, dob,fullname} = req.body; // Include password in destructuring
  const userData = new userModel({ username, email, dob ,fullname}); // Use dob instead of fullname

  userModel.register(userData, req.body.password)
    .then(function() {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/profile");
      })
    })
});


router.get('/profile',isLoggedIn,async function(req,res,next){
  const user=await userModel.findOne({
    username:req.session.passport.user
  }).populate("posts");
  console.log(user);
  res.render("profile.ejs",{user});
});

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true
}),function(req,res){
})

router.get("/logout",function(req,res){
  req.logout(function(err){
    if(err){
      return next(err);
    }
    res.redirect('/');
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;