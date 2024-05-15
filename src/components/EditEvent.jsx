import { useState, useContext } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { Modal, TextInput, ColorInput, Button } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

const API_URL = import.meta.env.VITE_API_URL;

const EditEvent = ({ event }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [opened, setOpened] = useState(false);
  const [eventTitle, setEventTitle] = useState(event.title);
  const [color, setColor] = useState(event.color);
  const [timeStart, setTimeStart] = useState(new Date(event.start));
  const [timeEnd, setTimeEnd] = useState(new Date(event.end));

  const formatTime = (date) => {
    const timeString = date.toTimeString().split(" ")[0];
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  const handleSubmit = async () => {
    const eventData = {
      ...event, // spread the existing event data for preservation
      eventTitle,
      date: timeStart.toISOString().split("T")[0],
      timeStart: formatTime(timeStart),
      timeEnd: formatTime(timeEnd),
      color,
    };

    try {
      const response = await fetch(`${API_URL}/api/events/${event.id}`, {
        method: "PUT", // Change to PUT for update
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      alert("Event updated successfully!");
      setOpened(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Button onClick={() => setOpened(true)}>Edit Event</Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Edit Event"
      >
        {/* Form elements go here */}
        <TextInput
          label="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        <ColorInput label="Color" value={color} onChange={setColor} />
        <DateTimePicker
          label="Start Time"
          value={timeStart}
          onChange={setTimeStart}
        />
        <DateTimePicker
          label="End Time"
          value={timeEnd}
          onChange={setTimeEnd}
        />
        <Button onClick={handleSubmit}>Update Event</Button>
      </Modal>
    </>
  );
};

export default EditEvent;
