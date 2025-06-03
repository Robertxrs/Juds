const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const saleSchema = new mongoose.Schema({
  items: [saleItemSchema],
  total: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['Dinheiro', 'Cartão', 'Pix'],
    required: true
  },
  cashReceived: Number,
  change: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);
