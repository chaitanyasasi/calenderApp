import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import EventForm from "./EventForm";
import "./calend.css";

function CalendarComponent() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  // Fetch all events from the backend
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5230/api/events/added");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Request permission to show notifications
  const requestNotificationPermission = async () => {
    if (Notification.permission === "default") {
      try {
        const permission = await Notification.requestPermission();
        console.log(`Notification permission: ${permission}`);
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
    requestNotificationPermission();
  }, []);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowForm(true);
    setCurrentEvent(null);
  };

  const getEventsForSelectedDate = () => {
    return events.filter(
      (event) => new Date(event.date).toLocaleDateString() === selectedDate.toLocaleDateString()
    );
  };

  const handleUpdateEvent = (event) => {
    setSelectedDate(new Date(event.date));
    setCurrentEvent(event);
    setShowForm(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (currentEvent) {
        await axios.put(`http://localhost:5230/api/events/update/${currentEvent._id}`, eventData);
      } else {
        await axios.post("http://localhost:5230/api/events/add", eventData);
      }
      fetchEvents();
      setShowForm(false);

      // Schedule notification after saving the event
      handleEventNotification(eventData);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5230/api/events/delete/${id}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };


  // Schedule notification for the event
  const handleEventNotification = (event) => {
    const eventDate = new Date(event.date);
    const eventStartTime = event.startTime.split(":");
    eventDate.setHours(eventStartTime[0], eventStartTime[1], 0);

    const notificationTime = new Date(eventDate);
    const timeDiff = notificationTime.getTime() - Date.now();

    console.log("Notification scheduled for:", notificationTime);
    console.log("Time difference for notification (ms):", timeDiff);

    if (timeDiff > 0) {
      setTimeout(() => {
        console.log("Triggering notification now...");
        showNotification(event);
      }, timeDiff);
    } else {
      console.log("Event time has already passed, showing notification immediately.");
      showNotification(event);
    }
  };

  // Show notification
  const showNotification = (event) => {
    console.log("Attempting to show notification...");

    if (Notification.permission === "granted") {
      const notification = new Notification(`Event: ${event.title}`, {
        body: `${event.description} at ${event.location}`,
      });

      notification.onclick = () => {
        notification.close();
      };

      console.log("Notification shown:", notification);

      // Add snooze functionality
      setTimeout(() => {
        const snoozeNotification = new Notification(`Snooze: ${event.title}`, {
          body: "Your event is coming up again in 5 minutes!",
        });

        snoozeNotification.onclick = () => {
          snoozeNotification.close();
        };
      }, 5 * 60 * 1000); // 5 minutes snooze
    } else {
      console.log("Notification permission not granted.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Calendar App</h1>

      {/* Calendar component */}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <Calendar
                onClickDay={handleDayClick}
                tileClassName={({ date }) => {
                  const eventDate = events.find(
                    (event) =>
                      new Date(event.date).toLocaleDateString() === date.toLocaleDateString()
                  );
                  return eventDate ? "highlight" : null;
                }}
              />
            </div>
          </div>
        </div>

        {/* Event form for the selected date */}
        {showForm && (
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <EventForm
                  selectedDate={selectedDate}
                  event={currentEvent}
                  onSave={handleSaveEvent}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Display events for the selected date */}
      <div className="mt-4">
        <h2>Events on {selectedDate.toLocaleDateString()}</h2>
        {getEventsForSelectedDate().length === 0 ? (
          <p>No events for this date.</p>
        ) : (
          getEventsForSelectedDate().map((event) => (
            <div key={event._id} className="event mb-3 p-3 border rounded shadow-sm">
              <strong>{event.title}</strong>
              <p>{event.description}</p>
              <p>Location: {event.location}</p>
              <p>Time: {event.startTime} - {event.endTime}</p>
              <button
                className="btn btn-warning btn-sm mr-2"
                onClick={() => handleUpdateEvent(event)}
              >
                Update
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteEvent(event._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CalendarComponent;
