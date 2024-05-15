import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Table,
  Group,
  Text,
  useMantineTheme,
  ScrollArea,
} from "@mantine/core";

const API_URL = import.meta.env.VITE_API_URL;

const Lastcourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const getLastCourses = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${API_URL}/api/courses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const courses = await response.json();
      if (response.ok) setCourses(courses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLastCourses();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const rows = courses.map((item) => (
    <Table.Tr key={item._id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={40} src={item.coursePictureUrl} radius={40} />
          <div justify="start">
            <Text fz="sm" fw={500}>
              {item.courseName}
            </Text>
            <Text c="dimmed" fz="xs" style={{ textAlign: "left" }}>
              Course name
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{formatDate(item.startDate)}</Text>
        <Text fz="xs" c="dimmed">
          Start
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{formatDate(item.endDate)}</Text>
        <Text fz="xs" c="dimmed">
          End
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">
          {item.teacher && item.teacher.firstName}{" "}
          {item.teacher && item.teacher.lastName}
        </Text>
        <Text fz="xs" c="dimmed">
          Teacher
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea h={500}>
      <Table.ScrollContainer minWidth={500}>
        <Table verticalSpacing="md">
          {courses.length > 0 ? (
            <Table.Tbody> {rows} </Table.Tbody>
          ) : (
            <h3>There is no course to show!</h3>
          )}
        </Table>
      </Table.ScrollContainer>
    </ScrollArea>
  );
};

export default Lastcourses;
