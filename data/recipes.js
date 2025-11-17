// database/Recipe.js
const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  name: String,
  ingredients: String,
  steps: String,
  time: String,
  equipment: String,
  image: String,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', RecipeSchema);
