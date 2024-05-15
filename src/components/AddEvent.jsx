import { useState, useContext } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { Modal, TextInput, ColorInput, Button } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
const API_URL = import.meta.env.VITE_API_URL;

const AddEvent = ({ courseId }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [opened, setOpened] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [color, setColor] = useState("");
  const [timeStart, setTimeStart] = useState(new Date());
  const [timeEnd, setTimeEnd] = useState(new Date());

  const formatTime = (date) => {
    const timeString = date.toTimeString().split(" ")[0]; // Gets 'HH:MM:SS'
    const [hours, minutes] = timeString.split(":"); // Splits into components
    return `${hours}:${minutes}`; // Returns 'HH:MM'
  };

  const handleSubmit = async () => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeek = daysOfWeek[timeStart.getDay()];
    const date = timeStart.toISOString().split("T")[0]; // Extract only the date part

    const eventData = {
      courseId,
      eventTitle,
      date,
      timeStart: formatTime(timeStart),
      timeEnd: formatTime(timeEnd),
      dayOfWeek,
      color,
    };

    try {
      const response = await fetch(`${API_URL}/api/events/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Failed to add event");
      }

      alert("Event added successfully!");
      setOpened(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Button onClick={() => setOpened(true)}>Create Event</Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Create New Event"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextInput
            label="Event Title"
            placeholder="Enter event title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            required
          />
          <ColorInput
            label="Color"
            placeholder="Select color"
            value={color}
            onChange={setColor}
            required
          />
          <DateTimePicker
            clearable
            label="Start Time"
            value={timeStart}
            onChange={setTimeStart}
            required
          />
          <DateTimePicker
            clearable
            label="End Time"
            value={timeEnd}
            onChange={setTimeEnd}
            required
          />
          <Button type="submit" style={{ marginTop: 20 }}>
            Submit Event
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default AddEvent;
