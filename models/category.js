const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  coverImage: {
    type: String,
    required: true
  },
  recipeCount: {
    type: Number,
    default: 0
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
