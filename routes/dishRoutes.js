// routes/dishRoutes.js
const express = require('express');
const router = express.Router();
const Dish = require('../models/model');

// GET: Return all dishes
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find({});
    res.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({ error: 'An error occurred while fetching dishes' });
  }
});
// GET: Return a dish by ID
router.get('/id/:id', async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    res.json(dish);
  } catch (error) {
    console.error('Error fetching dish by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the dish by ID' });
  }
});


// GET: Return a dish by name
router.get('/:name', async (req, res) => {
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
router.post('/', async (req, res) => {
  try {
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

// PUT: Update a dish by _id
router.put('/:id', async (req, res) => {
  try {
    if (req.body.cookingTime) req.body.cookingTime = Number(req.body.cookingTime);
    if (req.body.spiceLevel) req.body.spiceLevel = Number(req.body.spiceLevel);

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

// DELETE: Delete a dish by _id
router.delete('/:id', async (req, res) => {
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

module.exports = router;
