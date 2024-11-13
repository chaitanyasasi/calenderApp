const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: String,
  location: String,
  startTime: { type: String, required: true }, // Store start time as a string
  endTime: { type: String, required: true },   // Store end time as a string
});



module.exports = mongoose.model("events", eventSchema, "events");
