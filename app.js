const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSession=require("express-session");
const userModel=require('./models/users');
const postModel=require('./models/posts');
const passport = require('passport');
const localStrategy=require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));
const { router: userRouter,isLoggedIn} = require('./routes/user');

const postRouter=require('./routes/post')
const app = express();
const flash=require("connect-flash");
// const initializePassport=require('./passport-config')
// initializePassport(passport,email=>users.find(user=>user.email==email));
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(expressSession({
  resave:false,
  saveUninitialized:false,
  secret:"heyvarun"
}));
app.use(passport.initialize());
app.use(passport.session()); 
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRouter);
app.use('/post',postRouter);


app.get('/',isLoggedIn,async function(req,res,next){
  const user=await userModel.findOne({username:req.session.passport.user})
  const posts=await postModel.find() 
  // populate("user")
  res.render("feed.ejs",{posts,nav:true});
})

app.get('/aboutUs',(req,res)=>{
  res.render('about',{nav:true});
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;