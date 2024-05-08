import dayjs from "dayjs";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { Calendar } from "@mantine/dates";
import { Indicator, Text, Title, HoverCard } from "@mantine/core";
import "@mantine/dates/styles.css";
const API_URL = import.meta.env.VITE_API_URL;

function SmallCalendarComponent() {
  const { isLoggedIn } = useContext(AuthContext);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const eventsData = await response.json();
        const formattedEvents = eventsData.reduce((acc, event) => {
          const dateKey = dayjs(event.date).format("YYYY-MM-DD");
          acc[dateKey] = acc[dateKey] || [];
          acc[dateKey].push(event);
          return acc;
        }, {});
        setEvents(formattedEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const renderEventDetails = (dayEvents) => (
    <div>
      <Title order={5}>{dayjs(dayEvents[0].date).format("MMMM D, YYYY")}</Title>
      {dayEvents.map((event, index) => (
        <Text key={index} size="sm">
          {event.timeStart} - {event.eventTitle}
        </Text>
      ))}
    </div>
  );

  return (
    <>
      <Calendar
        renderDay={(date) => {
          const dateString = dayjs(date).format("YYYY-MM-DD");
          const dayEvents = events[dateString];
          if (dayEvents && dayEvents.length > 0) {
            return (
              <HoverCard width={240} position="bottom" withArrow>
                <HoverCard.Target>
                  <Indicator size={6} color="red">
                    {dayjs(date).date()}
                  </Indicator>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  {renderEventDetails(dayEvents)}
                </HoverCard.Dropdown>
              </HoverCard>
            );
          }
          return dayjs(date).date();
        }}
      />
    </>
  );
}

export default SmallCalendarComponent;
