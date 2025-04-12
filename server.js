// server.js
require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.CONNECTION_URL;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static('public'));

// ---------------------------------------------------
// 1. Connect to MongoDB Atlas via Mongoose
// ---------------------------------------------------
mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});

// ---------------------------------------------------
// 2. Define the Dish Schema and Model
// ---------------------------------------------------
const dishSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  ingredients: [String],
  preparationSteps: [String],
  cookingTime: Number, // In minutes
  origin: String,
  // spiceLevel as a number from 0 to 5
  spiceLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  }
});

const Dish = mongoose.model('Dish', dishSchema);

// ---------------------------------------------------
// 3. CRUD REST API Routes
// ---------------------------------------------------

// GET: Return all dishes
app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await Dish.find({});
    res.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({ error: 'An error occurred while fetching dishes' });
  }
});

// GET: Return a dish by name
app.get('/api/dishes/:name', async (req, res) => {
  try {
    const dish = await Dish.findOne({ name: req.params.name });
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    res.json(dish);
  } catch (error) {
    console.error('Error fetching dish:', error);
    res.status(500).json({ error: 'An error occurred while fetching the dish' });
  }
});

// POST: Add a new dish
app.post('/api/dishes', async (req, res) => {
  try {
    console.log("Received dish data:", req.body);
    // Check if a dish with the same name already exists
    const existingDish = await Dish.findOne({ name: req.body.name });
    if (existingDish) {
      return res.status(409).json({ error: 'Dish already exists' });
    }
    const newDish = new Dish(req.body);
    await newDish.save();
    res.status(201).json(newDish);
  } catch (error) {
    console.error('Error adding dish:', error);
    res.status(500).json({ error: 'An error occurred when adding dish' });
  }
});

// PUT: Update an existing dish by its _id
app.put('/api/dishes/:id', async (req, res) => {
  try {
    if (req.body.spiceLevel) {
      req.body.spiceLevel = Number(req.body.spiceLevel);
    }
    const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    res.json(updatedDish);
  } catch (error) {
    console.error('Error updating dish:', error);
    res.status(500).json({ error: 'An error occurred when updating dish' });
  }
});

// DELETE: Delete a dish by its _id
app.delete('/api/dishes/:id', async (req, res) => {
  try {
    const deletedDish = await Dish.findByIdAndDelete(req.params.id);
    if (!deletedDish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    console.error('Error deleting dish:', error);
    res.status(500).json({ error: 'An error occurred when deleting dish' });
  }
});

// ---------------------------------------------------
// 4. Start the Express Server
// ---------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
