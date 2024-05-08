import cx from "clsx";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { Table, ScrollArea } from "@mantine/core";
import classes from "../styles/TableScrollArea.module.css";
const API_URL = import.meta.env.VITE_API_URL;

export function EventTable() {
  const { isLoggedIn } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [data, setData] = useState([]);
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
        setData(eventsData);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to sort data by date and time
  const sortEventsByDateAndTime = (data) => {
    return data.sort((a, b) => {
      // First compare the dates
      const dateComparison = new Date(a.date) - new Date(b.date);
      if (dateComparison !== 0) {
        return dateComparison;
      }
      // If dates are the same, compare times
      const timeA = a.timeStart.split(":").map(Number); // Convert "hh:mm" to [hh, mm]
      const timeB = b.timeStart.split(":").map(Number);
      // Compare hours first, then minutes if hours are the same
      return timeA[0] - timeB[0] || timeA[1] - timeB[1];
    });
  };

  // Filtering events that are today or earlier
  const filterPastEvents = (data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to 00:00:00 to compare only dates
    return data.filter((item) => new Date(item.date) >= today);
  };

  // Sorting and filtering the data
  const sortedAndFilteredData = sortEventsByDateAndTime(filterPastEvents(data));

  // Then map over the sorted and filtered data to create table rows
  const rows = sortedAndFilteredData.map((row) => (
    <Table.Tr key={row._id}>
      <Table.Td>{formatDate(row.date)}</Table.Td>
      <Table.Td>{row.timeStart}</Table.Td>
      <Table.Td>{row.eventTitle}</Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea
      h={300}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <Table>
        <Table.Thead
          className={cx(classes.header, { [classes.scrolled]: scrolled })}
        >
          <Table.Tr>
            <Table.Th>Date</Table.Th>
            <Table.Th>Start Time</Table.Th>
            <Table.Th>Course</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
export default EventTable;