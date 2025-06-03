const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  unit:  { type: String, required: true },
  cost:  { type: Number, required: true },
  stock: { type: Number, required: true }
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
