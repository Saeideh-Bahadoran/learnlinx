import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, Table, Group, Text, Title } from "@mantine/core";

const API_URL = import.meta.env.VITE_API_URL;

export function StudentsList() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const getAllStudents = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${API_URL}/api/users/teacher/students`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const students = await response.json();
      if (response.ok) setStudents(students);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const rows = students.map((item) => (
    <Table.Tr key={item._id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={40} src={item.profilePictureUrl} radius={40} />
          <div>
            <Text fz="sm" fw={500}>
              {item.firstName} {item.lastName}
            </Text>
            <Text c="dimmed" fz="xs" style={{ textAlign: "left" }}>
              Name
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.email}</Text>
        <Text fz="xs" c="dimmed">
          Email Address
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.phoneNumber}</Text>
        <Text fz="xs" c="dimmed">
          Phone Number
        </Text>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Title bg={"violet"} c={"white"} order={2} my={"24px"}>
        My Students
      </Title>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="md">
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  );
}

export default StudentsList;
