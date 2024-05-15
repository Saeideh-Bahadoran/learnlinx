import LargeCalendarComponent from "../components/LargeCalendarComponent";
import EventTable from "../components/EventTable";
import { EventContext } from "../context/event.context";
import { Container } from "@mantine/core";
const CalendarPage = () => {
  return (
    <div style={{ paddingTop: "20px" }}>
      <Container size="xl" >
        <LargeCalendarComponent  />
        <h1 style={{ padding: "50px" }}>Upcoming Events:</h1>
        <EventTable />
      </Container>
    </div>
  );
};

export default CalendarPage;
