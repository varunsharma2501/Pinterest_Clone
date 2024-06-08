const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/Recipe");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true,
  },
  ingredients:{
      type:[String],
  },
  image:{
    type:String,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
  },
  reviews: {
    type:Number,
    default:0
  },
  rating:{
    type:Number,
    min:0,
    max:5,
    default:0
  },
  video:{
    type:String,
  }
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
