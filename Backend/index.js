const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");

const eventRoutes = require("./routes/eventRoutes"); // Adjust path as necessary

// Middleware to parse JSON
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/calender", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Use routes
app.use("/api/events", eventRoutes);

// Start server
const PORT = process.env.PORT || 5230;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
