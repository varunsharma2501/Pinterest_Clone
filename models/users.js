const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinterestClone");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dp: {
    type: String,  // Assuming dp is a URL or a path to the display picture
    default: ''
  },
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post',
  }],
  full_name: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
