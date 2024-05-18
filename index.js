require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');
const cors = require('cors');

// Add CORS middleware
app.use(cors());

connectDB();

app.use(express.json());


const authRoutes = require('./Server/routes/routes');
app.use('/', authRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
