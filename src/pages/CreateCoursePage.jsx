
//           {/* <DateInput
//             label="Start date"
//             placeholder="Start date"
//             withAsterisk
//             mt="md"
//             key={form.key("startDate")}
//             value={startDate}
//             onChange={(value) => setStartDate(value)}
//           />
//           <DateInput
//             label="End date"
//             placeholder="End date"
//             mt="md"
//             key={form.key("endDate")}
//             value={endDate}
//             onChange={(value) => setEndDate(value)}
//           /> */}


// export default CreateCoursePage;
import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { Button, Group, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX, IconCheck } from '@tabler/icons-react';

const CreateCoursePage = ({ course, notifications }) => {
  const [isVisible, setIsVisible] = useState(true);
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  const form = useForm({
    initialValues: {
      courseName: course.courseName ?? "",
    },
  });

  const handleCancel = () => {
    form.setValues({
      courseName: course.courseName ?? "",
    });
    setIsVisible(false); // Close the form
  };

  const handleNameChange = (event) => {
    form.setValues({
      ...form.values,
      courseName: event.currentTarget.value,
    });
  };

  return (
    <>
      {isVisible && (
        <form
          onSubmit={form.onSubmit(async () => {
            const storedToken = localStorage.getItem("authToken");

            try {
              // console.log("form***********", form.values);
              // console.log(storedToken);
              // console.log(JSON.stringify(form.values));
              const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/courses/${course._id}`,
                {
                  method: "PUT",

                  headers: {
                    Authorization: `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(form.values), // Use form values directly
                }
              );

              if (response.ok) {
               
                
                <Notification icon={checkIcon} color="teal" title="All good!" mt="md">
                Everything is fine
              </Notification>
                // notifications.show({
                //   title: "Change the course information",
                //   message:
                //     "Hey there, you succesfuly changed the course information",
                // });
              }
              else{
                <Notification icon={xIcon} color="red" title="Bummer!">
        Something went wrong
      </Notification>
              }
            } catch (error) {
              console.log(" Error by updating the course ", error);
            }
          })}
        >
          <h1>Create Course Page</h1>
          <TextInput
            label="Name of the course"
            placeholder="Name"
            withAsterisk
            value={form.values.courseName}
            onChange={handleNameChange}
          />

//           <DateInput
            label="Start date"
            placeholder="Start date"
            withAsterisk
            mt="md"
            key={form.key("startDate")}
            value={startDate}
            onChange={(value) => setStartDate(value)}
          />
          <DateInput
            label="End date"
            placeholder="End date"
            mt="md"
            key={form.key("endDate")}
            value={endDate}
            onChange={(value) => setEndDate(value)}
          /> 

          <Group justify="flex-end" mt="md">
            <Button type="submit">Save</Button>
            <Button color="gray" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </Group>
        </form>
      )}
    </>
  );
};

export default CreateCoursePage;
