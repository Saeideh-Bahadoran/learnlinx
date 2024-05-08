import React, { useState } from "react";
import { useForm } from "@mantine/form";
import { Button, Group, TextInput, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";

const EditCourse = ({ course, close, save }) => {
  console.log(course);
  const form = useForm({
    initialValues: {
      courseName: course.courseName ?? "",
      startDate:
        new Date(course.startDate) ?? new Date("2025-05-01T00:00:00.000Z"),
      endDate: new Date(course.endDate) ?? new Date("2025-05-01T00:00:00.000Z"),
      coursePictureUrl: course.coursePictureUrl ?? "",
      studentList: course.studentList ?? [],
      description: course.description ?? "",
      zoomLink: course.zoomLink ?? "",
    },
    initialDirty: false,
    clearInputErrorOnChange: true,
  });

  const handleCancel = () => {
    close();
  };

  return (
    <>
      <form
        onSubmit={form.onSubmit(async () => {
          const storedToken = localStorage.getItem("authToken");

          console.log(form.values);

          try {
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
              save();
            }
          } catch (error) {
            console.log(" Error by updating the course ", error);
          }
        })}
      >
        <TextInput
          label="Name of the course"
          placeholder="Name"
          withAsterisk
          key={form.key("courseName")}
          {...form.getInputProps("courseName")}
        />
        <DateInput
          label="Start date"
          placeholder="Start date"
          key={form.key("startDate")}
          {...form.getInputProps("startDate")}
        />
        <DateInput
          label="End date"
          placeholder="End date"
          key={form.key("endDate")}
          {...form.getInputProps("endDate")}
        />

        <Textarea
          label="Description"
          placeholder="Course description"
          key={form.key("description")}
          {...form.getInputProps("description")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Save</Button>
          <Button color="gray" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </Group>
      </form>
    </>
  );
};

export default EditCourse;