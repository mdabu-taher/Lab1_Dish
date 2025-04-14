// ---------------------------------------------------
// 2. Define the Dish Schema and Model
// ---------------------------------------------------
const mongoose = require('mongoose');
const dishSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  ingredients: [String],
  preparationSteps: [String],
  cookingTime: {
    type: Number,
    required: true,
    min: 1  // Ensure the cooking time is at least 1 minute
  },
  origin: String,
  // spiceLevel as a number, for example, between 0 and 5
  spiceLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  }
});

module.exports = mongoose.model('Dish', dishSchema);