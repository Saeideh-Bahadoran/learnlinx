import {
  Button,
  Group,
  Text,
  TextInput,
  Textarea,
  Container,
  Paper,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { DateInput } from "@mantine/dates";
import { useNavigate } from "react-router-dom";

const CreateNewCourse = () => {
  const [course, setCourse] = useState([]);
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState("");
  const [coursePictureUrl, setCoursePictureUrl] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState();

  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    initialValues: {
      courseName: "",
      coursePictureUrl: "",
      startDate: new Date(),
      endDate: new Date(),
      studentList: [],
      description: "",
    },
  });

  return (
    <>
      <Container size={420} my={40}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <h1>Create a New Course</h1>
          {errorMessage && (
            <Text color="red" align="center" size="sm" mb="lg">
              {errorMessage}
            </Text>
          )}
          <form
            onSubmit={form.onSubmit(async () => {
              const storedToken = localStorage.getItem("authToken");

              console.log(form.values);

              try {
                const response = await fetch(
                  `${import.meta.env.VITE_API_URL}/api/courses`,
                  {
                    method: "POST",

                    headers: {
                      Authorization: `Bearer ${storedToken}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form.values),
                  }
                );

                if (response.ok) {
                  console.log(" OK ");
                  navigate(`../courses`);
                } else {
                  const data = await response.json();
                  setErrorMessage(
                    data.message ||
                      "Failed to create course due to unknown error"
                  );
                  setTimeout(() => {
                    setErrorMessage("");
                  }, 5000);
                }
              } catch (error) {
                console.log(" Error by updating the course ", error);
              }
            })}
          >
            <TextInput
              withAsterisk
              label="Course Name:"
              placeholder="Course Name"
              key={form.key("courseName")}
              {...form.getInputProps("courseName")}
            />
            <DateInput
              label="Start Date:"
              placeholder="Start Date"
              key={form.key("startDate")}
              {...form.getInputProps("startDate")}
            />
            <DateInput
              label="End Date:"
              placeholder="End Date"
              key={form.key("endDate")}
              {...form.getInputProps("endDate")}
            />

            <Textarea
              label="Description:"
              placeholder="Course description"
              key={form.key("description")}
              {...form.getInputProps("description")}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit">Save Course</Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default CreateNewCourse;
