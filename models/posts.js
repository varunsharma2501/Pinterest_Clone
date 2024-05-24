const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/pinterestClone");

const postSchema = new mongoose.Schema({
  post_text: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
  },
  likes: {
    type: Array, // Assuming likes are references to User IDs
    default: [],
  }
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
