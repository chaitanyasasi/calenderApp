const express = require("express");
const Event = require("../model/EventModel");
const router = express.Router();

// Create an Event
router.post("/add", async (req, res) => {
  try {
    const { title, date, description, location, startTime, endTime } = req.body;
    const newEvent = new Event({
      title,
      date,
      description,
      location,
      startTime,
      endTime,
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add event" });
  }
});

// Get All Events
router.get("/added", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update Event
router.put("/update/:id", async (req, res) => {
  try {
    const { title, date, description, location, startTime, endTime } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, date, description, location, startTime, endTime },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Delete Event
router.delete("/delete/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
