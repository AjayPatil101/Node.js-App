require('dotenv').config();
const express = require("express");
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Add CORS middleware
    app.use(cors());

    // Body parser middleware
    app.use(express.json());

    // Routes
    const authRoutes = require('./Server/routes/routes');
    app.use('/', authRoutes);

    // Start the server
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);  // Exit the process with an error code
  }
};

startServer();
