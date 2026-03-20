import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Route from './models/route.model.js'; 
import routesData from '../data/routes.js';  

dotenv.config();



const seedDB = async () => {
  try {
    
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    //Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    //Clear old routes so you don't have duplicates
    await Route.deleteMany({});
    
    //Insert your 10 routes with junctions
    await Route.insertMany(routesData);

    
    console.log("Success: 10 Priority Routes with Junctions have been seeded!");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedDB();