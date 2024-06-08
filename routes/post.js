const express = require('express');
const router = express.Router();// Ensure the correct path
const postModel = require('../models/posts');  // Ensure the correct path
const userModel = require('../models/users');  // Ensure the correct path
const categoryModel=require('../models/category')
// const passport=require("passport");
const upload=require('./multer')
// const localStrategy=require("passport-local");
const {isLoggedIn } = require('./user');

// passport.use(new localStrategy(userModel.authenticate()));

router.get("/createPost",isLoggedIn,function(req,res){
  res.render("addPost.ejs",{nav:true});
})

router.post('/createPost', isLoggedIn, upload.single("postImage"), async function(req, res, next) {
    try {
        const user = await userModel.findOne({ username: req.session.passport.user });

        // Extract ingredients from the request body
        const ingredients = req.body.ingredients || [];

        // Find the category based on the category name provided in the request
        const category = await categoryModel.findOne({ name: req.body.postCategory });

        const post = await postModel.create({
            user: user._id,
            title: req.body.postTitle,
            description: req.body.postDescription,
            image: req.file.filename,
            ingredients: ingredients // Assign the extracted ingredients array
        });

        user.posts.push(post._id);
        await user.save();

        // Add the post to the category's posts array
        category.posts.push(post._id);
        await category.save();

        res.redirect("/user/profile");
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.get('/feed',isLoggedIn,async function(req,res,next){
    // const user=await userModel.findOne({username:req.session.passport.user})
    const posts=await postModel.find()
    
    // populate("user")
    res.render("feed.ejs",{posts,nav:true});
  })

  router.get('/categories', async function(req, res, next) {
    try {
        // Fetch all categories from the category schema
        const categories = await categoryModel.find();

        // Render the categories page and pass the categories data to the view
        res.render('categories', { categories ,nav:true});
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/category/:category', async (req, res, next) => {
    try {
        const categoryName = req.params.category;
        const category = await categoryModel.findOne({ name: categoryName }).populate('posts');

        if (!category) {
            return res.status(404).send('Category not found');
        }

        const posts = category.posts;

        res.render('categoryPosts.ejs', { categoryName, posts,nav:true });
    } catch (error) {
        console.error("Error fetching category posts:", error);
        res.status(500).send("Internal Server Error");
    }
});  

router.get('/:title',isLoggedIn,async function(req,res,next){
    try {
        const recipe = await postModel.findOne({ title: req.params.title }).populate('user');
        if (!recipe) {
          return res.status(404).send('Recipe not found');
        }
        res.render('recipe', { recipe, nav: true });
      } catch (err) {
        next(err);
      }
})
  module.exports = router;