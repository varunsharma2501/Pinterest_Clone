const mongoose = require('mongoose');
const plm=require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/pinterestClone");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
  },
  password: {
    type: String,
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
  dob: {
    type: Date, // Use 'Date' instead of 'date' (capitalized)
  }

}, {
  timestamps: true
});

userSchema.plugin(plm);
const User = mongoose.model('User', userSchema);

module.exports = User;