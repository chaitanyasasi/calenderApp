import React, { useState, useEffect } from "react";

function EventForm({ selectedDate, onSave, event, onCancel }) {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [location, setLocation] = useState(event?.location || "");
  const [startTime, setStartTime] = useState(event?.startTime || "");
  const [endTime, setEndTime] = useState(event?.endTime || "");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setLocation(event.location);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      date: selectedDate,
      description,
      location,
      startTime,
      endTime,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
      />
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
      />
      <button type="submit">{event ? "Update" : "Create"} Event</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}

export default EventForm;
