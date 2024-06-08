const mongoose = require('mongoose');
const plm=require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Recipe");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required:true
  },
  password: {
    type: String,
    // required:true,
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
  followers:{
    type:Number,
    default:0
  },
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post',
  }],
  dob: {
    type: Date, // Use 'Date' instead of 'date' (capitalized)
  },
  reviews:{
    type:Number,
    default:0
  },
  rating:{
    type:Number,
    min: 0,
    max: 5,
    default:0,
  },
  reports:{
    type:Number,
    default:0,
  },
  country:{
    type:String,
  },
}, {
  timestamps: true
});

userSchema.plugin(plm);
const User = mongoose.model('User', userSchema);

module.exports = User;