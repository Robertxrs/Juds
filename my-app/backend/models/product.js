const mongoose = require('mongoose');

const ingredientEntrySchema = new mongoose.Schema({
  ingredient:{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  unit:{ type: String, required: true },
  amount:{ type: Number, required: true }
});

const productSchema = new mongoose.Schema({
  name:{ type: String, required: true },
  price:{ type: Number, required: true },
  stock:{ type: Number, required: true },
  status:{ type: String, enum: ['Ativo','Inativo'], default: 'Ativo' },
  ingredients: [ingredientEntrySchema]
});

module.exports = mongoose.model('Product', productSchema);
