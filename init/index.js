if(process.env.NODE_ENV !== "production") {
    require("dotenv").config(); // load environment variables from .env file in development mode
}
const mongoose = require('mongoose');
const Meter = require("../models/meter.js");// Import the Listing model
const Alert = require("../models/alert.js");// Import the alert model
const User = require("../models/user.js");// Import the user model
const { sampleMeters, sampleAlerts } = require('./data.js');// Import the sample data

const MONGO_URL = process.env.MONGO_URL; // MongoDB connection URL
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
    await Alert.deleteMany({});

    const insertedAlerts = await Alert.insertMany(sampleAlerts);
    // Map alert IDs to their respective meters by name
    const alertMap = {};
    insertedAlerts.forEach(alert => {
        if (!alertMap[alert.name]) alertMap[alert.name] = [];
        alertMap[alert.name].push(alert._id);
    });

    // Assign alert ObjectIds to their respective meters
    const updatedMeters = sampleMeters.map(meter => {
        if (alertMap[meter.name]) {
            meter.alerts = alertMap[meter.name];
            meter.alertCount = alertMap[meter.name].length;
            meter.status = "Alert";
        }
        return meter;
    });

    // Insert updated meters
    await Meter.insertMany(updatedMeters);
    console.log("Database initialized with sample data");
}

initDB()
    .then(() => {
        console.log("Database initialization complete");
    })
    .catch((err) => {
        console.error("Error initializing database:", err);
    });
