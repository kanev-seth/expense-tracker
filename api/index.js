const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/transaction.js');
const mongoose = require("mongoose");
const app = express();

app.use(cors());
app.use(express.json());
app.get('/api/test', (req,res) => {
    res.json('test ok2');
});

app.post('/api/transaction', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const {name,description,datetime,price} = req.body;
    const transaction = await Transaction.create({
        name,description,datetime,price
    });
    res.json(transaction);
});

app.get('/api/transactions', async (req,res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find().sort({ datetime: -1 }); //grabbing/finding all of the transactions, without specifying anything about what to find.
    res.json(transactions);

});

app.listen(4040);