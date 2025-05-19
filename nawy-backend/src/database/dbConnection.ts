import mongoose from "mongoose";



export const dbConnection =()=>{


    mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/apartment-listings')
  .then(() => console.log('Connected to MongoDB TypeScript'))
  .catch(err => console.error('MongoDB connection error:', err));
}