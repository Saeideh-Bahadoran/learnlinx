import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@mantine/carousel/styles.css";
import { Carousel } from "@mantine/carousel";
import { HoverCard, Badge, Container } from "@mantine/core";

const API_URL = import.meta.env.VITE_API_URL;

import { Card, Image, Text, useMantineTheme } from "@mantine/core";

const CurrentCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const getAllCourses = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${API_URL}/api/courses/current-courses`, {
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

  const onClickCard = (courseId) => {
    // Navigate to CourseDetails component and pass courseId as props
    navigate(`../courses/${courseId}`);
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  const theme = useMantineTheme();

  return (
    <Carousel
      withIndicators
      height={300}
      slideSize="33.333333%"
      slideGap="xl"
      loop
      align="start"
      slidesToScroll={3}
    >
      {courses.length > 0 ? (
        courses.map((course, index) => (
          <Carousel.Slide key={course._id}>
            <Card
              withBorder
              radius="md"
              className="card"
              style={{ backgroundColor: "#D0BFFF" }}
              onClick={() => onClickCard(course._id)}
            >
              <Card.Section>
                <Image
                  src={course.coursePictureUrl}
                  fallbackSrc="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                  height={180}
                  width={150}
                />
              </Card.Section>

              <Text className="title" fw={500}>
                {course.courseName}
              </Text>

              <Container className="footer" gap="xs">
                <HoverCard width={280} shadow="md">
                  <HoverCard.Target>
                    <Badge variant="light" color="gray" size="xs" radius="md">
                      <Text fz="xs" span>
                        {" "}
                        {course.studentList.length}
                        {course.studentList.length === 0 ||
                        course.studentList.length === 1
                          ? " student "
                          : " students "}
                      </Text>
                    </Badge>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    {/* {console.log(course)} */}
                    {course.studentList.map((student, index) => (
                      <Text key={index} size="sm">
                        {student.firstName} {student.lastName}
                      </Text>
                    ))}
                  </HoverCard.Dropdown>
                </HoverCard>

                <Text span> enrolled in this class</Text>
              </Container>
            </Card>
          </Carousel.Slide>
        ))
      ) : (
        <h3>There is no current course to show!</h3>
      )}
    </Carousel>
  );
};

export default CurrentCourses;
