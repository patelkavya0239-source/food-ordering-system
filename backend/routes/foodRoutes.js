const express = require('express');
const FoodItem = require('../models/FoodItem');

const router = express.Router();

// Get all food items
router.get('/', async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a food item
router.post('/', async (req, res) => {
  try {
    const foodItem = new FoodItem(req.body);
    const savedFoodItem = await foodItem.save();
    res.status(201).json(savedFoodItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;