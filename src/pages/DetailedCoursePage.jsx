import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import {
  Text,
  Modal,
  Button,
  Group,
  Table,
  Avatar,
  Title,
  Container,
  Flex,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import EditCourse from "../components/EditCourse";
const API_URL = import.meta.env.VITE_API_URL;
import { IconCheck } from "@tabler/icons-react";
import { courseContext } from "../context/course.context.jsx";
import { AuthContext } from "../context/auth.context";

import AddEvent from "../components/AddEvent";
import { notifications } from "@mantine/notifications";
import AllUsers from "../components/AllUsers";

const DetailedCoursePage = () => {
  const { course, setCourse } = useContext(courseContext);

  const { isTeacher } = useContext(AuthContext);

  const checkIcon = <IconCheck style={{ width: "20rem", height: "20rem" }} />;
  const navigate = useNavigate();
  //const [course, setCourse] = useState([]);
  const { courseId } = useParams();
  const [opened, { open, close }] = useDisclosure(false);

  const getCourse = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${API_URL}/api/courses/${courseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const course = await response.json();
      if (response.ok) {
        setCourse(course);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    getCourse();
  }, []);

  const rows =
    course && course.studentList
      ? course.studentList.map((item) => (
          <Table.Tr key={item._id}>
            <Table.Td>
              <Group gap="sm">
                <Avatar size={40} src={item.profilePictureUrl} radius={40} />
                <div>
                  <Text c="dimmed" fz="xs" style={{ textAlign: "left" }}>
                    Name
                  </Text>
                  <Text fz="sm" fw={500}>
                    {item.firstName} {item.lastName}
                  </Text>
                </div>
              </Group>
            </Table.Td>
            <Table.Td>
              <Text fz="xs" c="dimmed">
                Email
              </Text>
              <Text fz="sm">{item.email}</Text>
            </Table.Td>
            <Table.Td>
              <Text fz="xs" c="dimmed">
                Phone number
              </Text>
              <Text fz="sm">{item.phoneNumber}</Text>
            </Table.Td>
          </Table.Tr>
        ))
      : [];

  const handleNavigateToVideoCall = () => {
    navigate(`/video-call/${courseId}`);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Edit Course" centered>
        <EditCourse
          course={course}
          close={close}
          save={() => {
            close();
            getCourse();
            notifications.show({
              icon: checkIcon,
              autoClose: 4000,
              message: "You succesfuly changed the course information",
            });
          }}
        />
      </Modal>
      <div>
        <Title bg={"violet"} c={"white"} order={3} mb={24} w={"100%"}>
          Course details
        </Title>
        {course ? (
          <Flex direction={["column", "column", "row"]} wrap="wrap">
            <Container mx={[0, 0, 16]} mb={16}>
              <Container
                mb={16}
                style={{
                  border: "solid 1px #1C7ED6",
                  borderRadius: "5px",
                  textAlign: "left",
                }}
              >
                <p style={{ textAlign: "left", fontSize: "18px" }}>
                  Course Name:
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    {course.courseName}
                  </span>
                </p>
                <p style={{ textAlign: "left", fontSize: "18px" }}>
                  Start Date:
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    {formatDate(course.startDate)}
                  </span>
                </p>
                <p style={{ textAlign: "left", fontSize: "18px" }}>
                  End Date:
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    {formatDate(course.endDate)}
                  </span>
                </p>
                <p style={{ textAlign: "left", fontSize: "18px" }}>
                  Description:
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    {course.description}
                  </span>
                </p>
                <p style={{ textAlign: "left", fontSize: "18px" }}>
                  Room Link:
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    <a href={course.zoomLink}>{course.zoomLink}</a>
                  </span>
                </p>

                <p style={{ textAlign: "left", fontSize: "18px" }}>
                  Teacher:
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    {course.teacher && course.teacher.firstName}{" "}
                    {course.teacher && course.teacher.lastName}
                  </span>
                </p>
              </Container>
              <Container
                style={{ border: "solid 1px #1C7ED6", borderRadius: "5px" }}
              >
                <Title order={3} mb={"24px"} w={"100%"}>
                  Students list
                </Title>
                <AllUsers course={course} />

                {rows && (
                  <Table.ScrollContainer minWidth={800}>
                    <Table verticalSpacing="md">
                      <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                )}
              </Container>
            </Container>
            <Container
              mx={16}
              w={300}
              style={{ border: "solid 1px #1C7ED6", borderRadius: "5px" }}
            >
              <Container h={400}>
                {course.coursePictureUrl && (
                  <Image
                    src={course.coursePictureUrl}
                    style={{
                      padding: "8px",
                      width: "250px",
                      height: "250px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                    fallbackSrc="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                  />
                )}
              </Container>

              {isTeacher && (
                <Flex direction={"column"} px={"50px"} gap={"16px"}>
                  <Button onClick={open}>Edit course</Button>
                  <Button variant="outline" onClick={handleNavigateToVideoCall}>
                    Start Video Call
                  </Button>
                  <AddEvent courseId={courseId} />
                </Flex>
              )}
            </Container>
          </Flex>
        ) : (
          <p>Loading course details...</p>
        )}
      </div>
    </>
  );
};

export default DetailedCoursePage;
