import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { dbConnection } from './database/dbConnection';
import { globalMiddleWare } from './middleware/globaleMiddlewareError';
import apartmentRouter from './modules/apartment/apartment.router';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
dbConnection()

//apartmentRouter to call Routes
app.use('/api/apartment',apartmentRouter)


// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Apartment Listing API' });
});

app.use(globalMiddleWare)
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});