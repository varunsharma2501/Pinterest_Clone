const mongoose = require('mongoose');
const Category = require('./models/category'); // Assuming your category model file is in the models directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Recipe', { useNewUrlParser: true, useUnifiedTopology: true });

// Define an array of category objects
const categories = [
  {
    name: 'breakfast',
    coverImage: '/images/breakfast.jpg',
    recipeCount: 0,
    posts: []
  },
  {
    name: 'lunch',
    coverImage: '/images/lunch.jpg',
    recipeCount: 0,
    posts: []
  },
  {
    name: 'dinner',
    coverImage: '/images/dinner.jpg',
    recipeCount: 0,
    posts: []
  },
  {
    name: 'drinks',
    coverImage: '/images/drinks.jpg',
    recipeCount: 0,
    posts: []
  },
  {
    name: 'deserts',
    coverImage: '/images/deserts.jpg',
    recipeCount: 0,
    posts: []
  },
  {
    name: 'snacks',
    coverImage: '/images/snacks.jpg',
    recipeCount: 0,
    posts: []
  },
  {
    name: 'healthy',
    coverImage: '/images/healthy.jpg',
    recipeCount: 0,
    posts: []
  },
  // Add more category objects as needed
];

// Insert the categories into the database
Category.insertMany(categories)
  .then(() => {
    console.log('Categories inserted successfully');
    mongoose.connection.close(); // Close the connection after insertion
  })
  .catch((error) => {
    console.error('Error inserting categories:', error);
    mongoose.connection.close(); // Close the connection on error
  });
