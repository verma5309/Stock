const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/stocks', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Stocks schema
const stockSchema = new mongoose.Schema({
  symbol: String,
  price: Number,
});

const Stock = mongoose.model('Stock', stockSchema);

// Initial data
const seedData = [
  { symbol: 'AAPL', price: 150.25 },
  { symbol: 'GOOGL', price: 280.50 },
  { symbol: 'MSFT', price: 320.75 },
];

const seedDatabase = async () => {
  try {
    await Stock.deleteMany(); 
    await Stock.insertMany(seedData); 
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase();

app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
