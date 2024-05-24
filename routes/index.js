const express = require('express');
const router = express.Router();
const userModel = require('../models/users');  // Ensure the correct path
const postModel = require('../models/posts');  // Ensure the correct path

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/createUser', async function(req, res, next) {  // Corrected `routes.get` to `router.get`
  try {
    let createdUser = await userModel.create({
      username: "varun25",
      password: "1234",
      email: "varuncares22@gmail.com",
      posts: [],
      full_name: "Varun Sharma"
    });
    res.send(createdUser);
  } catch (err) {
    next(err);
  }
});

router.get('/createPost',async function(req,res,next)
{
  try{
    let createdPost=await postModel.create({
      post_text:"This is my second post",
      user:'6650226a1f2decf305572be3',
    });

    let user=await userModel.findOne({_id:"6650226a1f2decf305572be3"});
    user.posts.push(createdPost._id);
    await user.save();
    res.send(createdPost);
  }
  catch(err){
    next(err);
  }

});

router.get("/allUserPosts",async function(req,res,next){
  let user=await userModel.findOne({_id:"6650226a1f2decf305572be3"}).populate('posts');
  res.send(user);
})
module.exports = router;
