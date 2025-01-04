const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();


const app = express();

// connect to database
connectDB();

// middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use(express.json());

// route
app.use('/api/auth', authRoutes);

// error handling
app.use((req, res) => {
    res.status(404);
    res.json({ message: 'Resource not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`console is running on port: http//:localhost:${PORT}`);
})