const mongoose = require('mongoose');
const Meter = require("../models/meter.js");// Import the Listing model
const initData = require('./data.js');// Import the sample data

const MONGO_URL= "mongodb://127.0.0.1:27017/gridplus"; // MongoDB connection URL
main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Function to initialize the database with sample data
// This function clears the existing meters and inserts the sample data
const initDB = async () => {
    await Meter.deleteMany({});
    await Meter.insertMany(initData.data);
    console.log("Database initialized with sample data");
}

initDB()
    .then(() => {
        console.log("Database initialization complete");
    })
    .catch((err) => {
        console.error("Error initializing database:", err);
    });
