const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

const { MongoMemoryServer } = require('mongodb-memory-server');
const isDev = process.env.NODE_ENV === 'development';

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const Ingredient = require(path.join(__dirname, 'models', 'ingredient'));
const Product = require(path.join(__dirname, 'models', 'product'));
const Sale = require(path.join(__dirname, 'models', 'sale'));

let mongod;
async function startMongoDB() {
  try {
    if (isDev) {
      await mongoose.connect('mongodb://localhost:27017/myapp', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Conectado ao MongoDB local');
    } else {
      mongod = await MongoMemoryServer.create({
    instance: {
      storageEngine: 'wiredTiger',
      dbPath: './mongo-data'
    }});
      const uri = mongod.getUri();
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log(`MongoDB embarcado rodando em: ${uri}`);
    }
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }

startMongoDB().catch(err => {
  console.error('Erro ao iniciar MongoDB:', err);
  process.exit(1);
})};

app.post('/sales', async (req, res) => {
  try {
    const { items, total, paymentMethod, cashReceived } = req.body;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ error: `Produto não encontrado: ${item.product}` });
      }
      product.stock -= item.quantity;
      await product.save();
    }
    const sale = new Sale({
      items,
      total,
      paymentMethod,
      cashReceived,
      change: paymentMethod === 'Dinheiro' ? cashReceived - total : 0,
      date: new Date()
    });

    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar venda' });
  }
});

app.get('/sales', async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate({
        path: 'items.product',
        model: 'Product',
        select: 'name'
      })
      .sort({ date: -1 });
    const formattedSales = sales.map(sale => {
      const items = sale.items.map(item => {
        if (!item.product || typeof item.product === 'string') {
          return {
            ...item.toObject(),
            product: {
              _id: 'unknown',
              name: 'Produto não disponível'
            }
          };
        }
        return {
          ...item.toObject(),
          product: {
            _id: item.product._id.toString(),
            name: item.product.name
          }
        };
      });
      return {
        _id: sale._id.toString(),
        date: sale.date,
        items,
        total: sale.total,
        paymentMethod: sale.paymentMethod,
        cashReceived: sale.cashReceived,
        change: sale.change
      };
    });
    res.json(formattedSales);
  } catch (err) {
    console.error('Erro detalhado:', err);
    res.status(500).json({
      error: 'Erro interno ao processar vendas',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, price, stock, status, ingredients } = req.body;
    const entries = await Promise.all(ingredients.map(async ent => {
      let ingId = ent.ingredient;
      if (!ingId) {
        const newIng = new Ingredient({
          name: ent.ingredientName,
          unit: ent.unit,
          cost: 0,
          stock: 0
        });
        await newIng.save();
        ingId = newIng._id;
      }
      return {
        ingredient: ingId,
        unit: ent.unit,
        amount: Number(ent.amount)
      };
    }));
    const prod = new Product({ name, price, stock, status, ingredients: entries });
    await prod.save();
    await Promise.all(entries.map(e =>
      Ingredient.findByIdAndUpdate(
        e.ingredient,
        { $inc: { stock: -(e.amount * Number(stock)) } },
        { new: true }
      )
    ));
    await prod.populate('ingredients.ingredient');
    res.status(201).json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao criar produto e atualizar estoque' });
  }
});

app.get('/products', async (req, res) => {
  const prods = await Product.find().populate('ingredients.ingredient');
  res.json(prods);
});

app.put('/products/:id', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.post('/ingredients', async (req, res) => {
  const ing = new Ingredient(req.body);
  await ing.save();
  res.status(201).json(ing);
});

app.get('/ingredients', async (req, res) => {
  const items = await Ingredient.find();
  res.json(items);
});

app.put('/ingredients/:id', async (req, res) => {
  const ing = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ing);
});

app.delete('/ingredients/:id', async (req, res) => {
  await Ingredient.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('Encerrando servidor...');

  await mongoose.connection.close();

  if (mongod) {
    await mongod.stop();
  }

  server.close(() => {
    console.log('Servidor encerrado');
    process.exit(0);
  });
});

app.listen(3000, () => console.log('Ok'));
