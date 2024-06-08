const express = require('express');
const router = express.Router();
const userModel = require('../models/users');  // Ensure the correct path  // Ensure the correct path
const passport=require("passport");
const upload=require('./multer')
const localStrategy=require("passport-local");
// const {isLoggedIn } = require('../app');

passport.use(new localStrategy(userModel.authenticate()));

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
  res.render('login.ejs',{error:req.flash('error'),nav:false});
})

router.get('/register',(req,res)=>{
  res.render('register.ejs',{nav:false});
})

router.get('/profile',isLoggedIn,async function(req,res,next){
  const user=await userModel.findOne({
    username:req.session.passport.user
  }).populate("posts");
  // console.log(user);
  res.render("profile.ejs",{user,nav:true});
});

router.get('/edit',isLoggedIn,async function(req,res,next){
  const user=await userModel.findOne({
    username:req.session.passport.user
  })
  res.render('editProfile.ejs',{user,nav:true});
})

router.post('/edit', isLoggedIn,async (req, res) => {
  try {
      const { username, fullname, password, email, country } = req.body;

      // Directly access the logged-in user object
      const user=await userModel.findOne({
        username:req.session.passport.user
      })

      // Update user data
      user.username = username;
      user.fullname = fullname;
      user.email = email;
      user.country = country;

      // If password is provided, hash it and update user's password
      if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
      }

      // Save the updated user object
      await user.save();

      // Redirect to profile page or any other page after successful update
      res.redirect('/profile');
  } catch (error) {
      // Handle error, maybe re-render the edit page with an error message
      console.error("Error updating user:", error);
      res.status(500).send("Internal Server Error");
  }
});



router.get("/logout",function(req,res){
  req.logout(function(err){
    if(err){
      return next(err);
    }
    res.redirect('/');
  });
})

router.post('/profilePicUpload',isLoggedIn,upload.single("profileImage"),async function(req,res,next){
  // console.log("inside the profile pic upload router")
  const user=await userModel.findOne({username:req.session.passport.user});
  user.dp=req.file.filename;
  await user.save();
  res.redirect("/user/profile");
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
  console.log("Inside the post register")
  const {username, email, dob,fullname} = req.body; // Include password in destructuring
  const userData = new userModel({ username, email, dob ,fullname}); // Use dob instead of fullname

  userModel.register(userData, req.body.password)
    .then(function() {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/user/profile");
      })
    })
});

router.post("/login",passport.authenticate("local",{
  successRedirect:"/user/profile",
  failureRedirect:"/user/login",
  failureFlash:true
}),function(req,res){
})

router.get('/all', async (req, res) => {
  try {
    const users = await userModel.find();
    res.render('allUsers', { nav:true,users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/:username',async(req,res)=>{
  try {
    const user = await userModel.findOne({ username: req.params.username }).populate('posts');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('userPosts', { nav:true,user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/user/login");
}

module.exports = { router, isLoggedIn};