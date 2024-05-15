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

const UpcomingCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const getUpcomingCourses = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${API_URL}/api/courses/upcoming-courses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const courses = await response.json();
      console.log("*****Upcoming: ", courses);
      if (response.ok) setCourses(courses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUpcomingCourses();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const onClickCard = (courseId) => {
    navigate(`../courses/${courseId}`);
  };

  const theme = useMantineTheme();
  const rows = courses.map((item) => (
    <Table.Tr key={item._id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={40} src={item.coursePictureUrl} radius={40} />
          <div>
            <Text fz="sm" fw={500}>
              {item.courseName}
            </Text>
            <Text c="dimmed" fz="xs">
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
      <Table.ScrollContainer>
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

export default UpcomingCourses;
